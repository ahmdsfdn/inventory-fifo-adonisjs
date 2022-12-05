import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Sale from "App/Models/Sale";
import Stock from "App/Models/Stock";
import {schema} from "@ioc:Adonis/Core/Validator";
import Purchase from "App/Models/Purchase";
import PurchaseDetail from "App/Models/PurchaseDetail";
import Database from '@ioc:Adonis/Lucid/Database'
import Product from "App/Models/Product";
import {Helper} from "App/Helpers/Helper";
import SaleDetail from "App/Models/SaleDetail";
import StockFlow from "App/Models/StockFlow";

export default class SalesController {
  public async index({request, params, response}: HttpContextContract) {
    const output = {
      'code' : '200',
      'message' : 'Data berhasil di ambil',
      'status' : 'success',
      'result' : await Sale.query().preload('detail')
    }
    return response.status(200).send(output)
  }

  public async store({request,response, auth}: HttpContextContract) {
    const validateSchema = schema.create({
      sale_number: schema.string(),
      date: schema.date(),
      total: schema.number(),
      customer_id: schema.number(),
      detail: schema.array().members(
        schema.object().members({
          stock: schema.number(),
          nominal: schema.number(),
          total: schema.number(),
          product_id: schema.number(),
        })
      ),
    });

    try {
      // Validasi

      const payload = await request.validate({
        schema: validateSchema
      })

      let total_beli = 0
      let total_jual = 0
      let total_check = 0
      let notif_cek_stock = []

      for (let i = 0; i < payload.detail.length; i++) {
        let product = await Product.find(payload.detail[i].product_id);
        let purchase_product = await Database
          .rawQuery('select SUM(stock_original) as total_beli from stocks where product_id = ?', [payload.detail[i].product_id])

        let sale_product = await Database
          .rawQuery('select SUM(stock) as total_jual from sale_details where product_id = ?', [payload.detail[i].product_id])

        total_beli  = parseInt(purchase_product.rows[0].total_beli ?? 0);
        total_jual = parseInt(sale_product.rows[0].total_jual ?? 0);

        let total_sisa = total_beli - total_jual;
        total_check = total_sisa - payload.detail[i].stock
        if (total_check < 0) {
          notif_cek_stock.push({
            message : 'Stock ' + product.name + ' tidak mencukupi. Tersisa ' + (total_sisa),
            product : product.name
          })
        }
      }

      if (notif_cek_stock.length>0){
        const output = {
          code: '400',
          errors: notif_cek_stock
        }

        return response.badRequest(output)
      }

      // End Validasi
      try{

      const user = await auth.use('api').user;

      const sale = await new Sale()
      sale.sale_number = payload.sale_number
      sale.date = Helper.formatDate(payload.date)
      sale.total = payload.total
      sale.user_id = user.id
      sale.customer_id = payload.customer_id

      const data_sale = await sale.save()

      let data_detail = [];

      for (let i = 0; i < payload.detail.length; i++) {
        data_detail.push(
          {
            sale_id: data_sale.id,
            user_id: user.id,
            stock: payload.detail[i].stock,
            nominal: payload.detail[i].nominal,
            total: payload.detail[i].total,
            date: data_sale.date,
            product_id: payload.detail[i].product_id
          }
        )
      }

      const sale_details = await SaleDetail.createMany(data_detail);

      const output = {
        code: '200',
        message: 'Data berhasil di input',
        status: 'success',
        result: await Sale.query().preload('detail').where('id',data_sale.id)
      }

      return response.status('200').send(output)
      }catch (e){
        return response.badRequest({
          code: '400',
          errors: e.message
        })
      }
    } catch (e) {
      return response.badRequest({
        code: '400',
        errors: e.messages.errors
      })
    }
  }

  public async show({params,response}: HttpContextContract) {
    const purchase = await Database.rawQuery(
      'Select *,' +
      '(Select array_to_json(array_agg(dt)) FROM (select * from sale_details where sale_details.sale_id = sales.id) dt ) as detail_sales' +
      ' From sales where id=?',[params.id]
    );
    return response.status(200).send({
      code: '200',
      message: 'Data berhasil diambil',
      status: 'success',
      result: purchase.rows[0]
    });
  }

  public async update({response, params, auth,request}: HttpContextContract) {
    const validateSchema = schema.create({
      sale_number: schema.string(),
      date: schema.date(),
      total: schema.number(),
      customer_id: schema.number(),
      detail: schema.array().members(
        schema.object().members({
          stock: schema.number(),
          nominal: schema.number(),
          total: schema.number(),
          product_id: schema.number(),
        })
      ),
    });

    try {
      // Validasi

      const payload = await request.validate({
        schema: validateSchema
      })

      let total_beli = 0
      let total_jual = 0
      let total_check = 0
      let notif_cek_stock = []

      for (let i = 0; i < payload.detail.length; i++) {
        let product = await Product.find(payload.detail[i].product_id);
        let purchase_product = await Database
          .rawQuery('select SUM(stock_original) as total_beli from stocks where product_id = ? ', [payload.detail[i].product_id])

        let sale_product = await Database
          .rawQuery('select SUM(stock) as total_jual from sale_details where product_id = ? AND sale_id != ?', [payload.detail[i].product_id,params.id])

        total_beli  = parseInt(purchase_product.rows[0].total_beli ?? 0);
        total_jual = parseInt(sale_product.rows[0].total_jual ?? 0);

        let total_sisa = total_beli - total_jual;
        total_check = total_sisa - payload.detail[i].stock
        if (total_check < 0) {
          notif_cek_stock.push({
            message : 'Stock ' + product.name + ' tidak mencukupi. Tersisa ' + (total_sisa),
            product : product.name
          })
        }
      }

      if (notif_cek_stock.length>0){
        const output = {
          code: '400',
          errors: notif_cek_stock
        }

        return response.badRequest(output)
      }

      // End Validasi
      try{

        await SaleDetail.query().where('sale_id',params.id).delete()

        const user = await auth.use('api').user;

        const sale = await Sale.findOrFail(params.id)
        sale.sale_number = payload.sale_number
        sale.date = Helper.formatDate(payload.date)
        sale.total = payload.total
        sale.user_id = user.id
        sale.customer_id = payload.customer_id

        const data_sale = await sale.save()

        let data_detail = [];

        for (let i = 0; i < payload.detail.length; i++) {
          data_detail.push(
            {
              sale_id: data_sale.id,
              user_id: user.id,
              stock: payload.detail[i].stock,
              nominal: payload.detail[i].nominal,
              total: payload.detail[i].total,
              date: data_sale.date,
              product_id: payload.detail[i].product_id
            }
          )
        }

        const sale_details = await SaleDetail.createMany(data_detail);

        const output = {
          code: '200',
          message: 'Data berhasil di rubah',
          status: 'success',
          result: await Sale.query().preload('detail').where('id',data_sale.id)
        }

        return response.status('200').send(output)
      }catch (e){
        return response.badRequest({
          code: '400',
          errors: e.message
        })
      }
    } catch (e) {
      return response.badRequest({
        code: '400',
        errors: e.messages.errors
      })
    }
  }

  public async destroy({params,response}: HttpContextContract) {
    const sale_details = await SaleDetail.query().where('sale_id', params.id)

    sale_details.forEach(async (item)=>{
      await item.delete();
    })

    const sale = await Sale.findOrFail(params.id)
    await sale.delete();

    return response.status(200).send({
      'code': '200',
      'status': 'success',
      'message': 'Data berhasil di hapus'
    })
  }

  // Approve
  public async approve({params,response,auth}:HttpContextContract){

    const user = await auth.use('api').user;

    const sale = await Sale.findOrFail(params.id)

    if (sale.status == '1'){
      return response.status(400).send({
        code: '400',
        status: 'failed',
        message: 'Data sudah pernah di approve',
        result: sale
      });
    }

    sale.status = 1
    sale.approved_at = Helper.formatDate(Date.now())
    sale.approved_by = user.id
    await sale.save()

    const sale_details = await SaleDetail.query().where('sale_id', params.id);

    sale_details.forEach(async (item) => {
      await this.prosesStock(item,sale,item.stock)
    })

    return response.status(200).send({
      'code': '200',
      'status': 'success',
      'message': 'Data berhasil di approve',
      'result' : sale,
    })
  }

  private async prosesStock(sale_detail,sale,pengurang){
    let stock_akumulasi = 0
    const stock = await Database.from('stocks')
      .join('purchases','stocks.purchase_id','=','purchases.id')
      .select('stocks.*')
      .where('stocks.product_id','=',sale_detail.product_id)
      .where('stocks.stock_left','>',0)
      .orderBy('purchases.date','asc')
      .limit(1)

    //Cek Stock All
    if (stock == ''){
      return
    }

    const stock_all = await Database.rawQuery(
      `SELECT stocks.*,SUM(stock_left) as stok_final FROM stocks WHERE stocks.product_id = ? GROUP BY stocks.id,stocks.product_id`,[sale_detail.product_id]
    )

    if (parseInt(stock_akumulasi) > parseInt(stock_all.rows[0].stok_final)){
      // Stock melebihi kapasitas
      return
    }

    stock_akumulasi = parseInt(stock[0].stock_left) - parseInt(pengurang)

    let stock_out = stock_akumulasi <= 0 ? stock[0].stock_left : (stock[0].stock_left - stock_akumulasi);
    let purchase_detail = await PurchaseDetail.findOrFail(stock[0].purchase_detail_id)
    let stock_flow = await new StockFlow();

    stock_flow.stock_id = stock[0].id
    stock_flow.sale_detail_id = sale_detail.id
    stock_flow.purchase_id = stock[0].purchase_id
    stock_flow.purchase_detail_id = stock[0].purchase_detail_id
    stock_flow.nominal_purchase = purchase_detail.nominal
    stock_flow.total_purchase = purchase_detail.nominal * stock_out
    stock_flow.sale_id = sale_detail.sale_id
    stock_flow.product_id = sale_detail.product_id
    stock_flow.jenis = "sale"
    stock_flow.number_transaction = sale.sale_number
    stock_flow.nominal_sale = sale_detail.nominal
    stock_flow.total_sale = sale_detail.nominal * stock_out
    stock_flow.date = sale_detail.date
    stock_flow.stock_out = stock_out

    await stock_flow.save()

    await Stock.query().where('id',stock[0].id).update({
      stock_left: (stock_akumulasi) <= 0 ? 0 : stock_akumulasi
    })

    if (stock_akumulasi < 0){
      await this.prosesStock(sale_detail,sale,stock_akumulasi*-1)
    }

    return
  }
}
