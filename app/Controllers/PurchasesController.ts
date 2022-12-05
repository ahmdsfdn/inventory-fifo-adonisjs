import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Purchase from "App/Models/Purchase";
import Supplier from "App/Models/Supplier";
import {schema} from "@ioc:Adonis/Core/Validator";
import PurchaseDetail from "App/Models/PurchaseDetail";
import {Helper} from "App/Helpers/Helper";
import Stock from "App/Models/Stock";
import StockFlow from "App/Models/StockFlow";
import Database from '@ioc:Adonis/Lucid/Database'
import User from "App/Models/User";

export default class PurchasesController {

  public async index({params, request, response }: HttpContextContract) {
    const purchase = await Purchase.query().preload('supplier').preload('detail')

    return response.status(200).send({
      code: '200',
      message: 'Data berhasil diambil',
      status: 'success',
      result: purchase
    })
  }

  public async store({request,auth,response}: HttpContextContract) {

    const validateSchema = schema.create({
      purchase_number: schema.string(),
      date: schema.date(),
      total: schema.number(),
      supplier_id: schema.number(),
      detail: schema.array().members(
        schema.object().members({
          stock: schema.number(),
          nominal: schema.number(),
          total: schema.number(),
          product_id: schema.number(),
        })
      ),
    })

    try {
      const payload = await request.validate({
        schema: validateSchema
      })
      try {
        const user = await auth.use('api').user;

        const purchase = await new Purchase()

        // Input Purchase
        purchase.purchase_number = payload.purchase_number
        purchase.date = Helper.formatDate(payload.date)
        purchase.total = payload.total
        purchase.user_id = user.id
        purchase.supplier_id = payload.supplier_id

        const purchase_data = await purchase.save()

        // Input Purchase Detail
        for (let i = 0; i < payload.detail.length; i++) {
          let purchase_detail = await new PurchaseDetail();

          purchase_detail.purchase_id = purchase_data.id
          purchase_detail.stock = payload.detail[i].stock
          purchase_detail.nominal = payload.detail[i].nominal
          purchase_detail.total = payload.detail[i].total
          purchase_detail.product_id = payload.detail[i].product_id
          purchase_detail.date = purchase_data.date
          purchase_detail.user_id = user.id

          await purchase_detail.save()
        }

        return response.status(201).send(
          {
            code: '201',
            message: 'Berhasil menambah data',
            status: 'success',
            result: await Purchase.query().preload('detail').where('id',purchase_data.id)
          }
        );

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

  public async show({params, response}: HttpContextContract) {
    return response.status(200).send({
      code: '200',
      message: 'Berhasil mengambil data',
      status: 'success',
      result: await Purchase.query().preload('detail').where('id',params.id)
    })
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response,auth}: HttpContextContract) {

    const validateSchema = schema.create({
      purchase_number: schema.string(),
      date: schema.date(),
      total: schema.number(),
      supplier_id: schema.number(),
      detail: schema.array().members(
        schema.object().members({
          stock: schema.number(),
          nominal: schema.number(),
          total: schema.number(),
          product_id: schema.number(),
        })
      ),
    })

    try {
      const payload = await request.validate({
        schema: validateSchema
      })

      try {
        const user = await auth.use('api').user;

        const purchase = await Purchase.findOrFail(params.id);
        purchase.purchase_number = payload.purchase_number
        purchase.date = Helper.formatDate(payload.date)
        purchase.total = payload.total
        purchase.user_id = user.id
        purchase.supplier_id = payload.supplier_id
        const purchase_data = await purchase.save()

        await PurchaseDetail.query().where('purchase_id',params.id).delete()

        payload.detail.forEach( async (item)=>{
          let purchase_detail = await new PurchaseDetail()

          purchase_detail.purchase_id = purchase_data.id
          purchase_detail.stock = item.stock
          purchase_detail.nominal = item.nominal
          purchase_detail.total = item.total
          purchase_detail.product_id = item.product_id
          purchase_detail.date = purchase_data.date
          purchase_detail.user_id = user.id

          await purchase_detail.save()
        })

        return response.status(200).send({
          'code': '200',
          'status': 'success',
          'message': 'Data berhasil di perbaharui',
          'result' : purchase,
        })

      } catch (e) {
        return response.badRequest({
          code: '400',
          errors: e.message
        })
      }
    } catch (e){
      return response.badRequest({
        code: '400',
        errors: e.messages.errors
      })
    }
  }

  public async destroy({params,response}: HttpContextContract) {
    const purchase_details = await PurchaseDetail.query().where('purchase_id', params.id)

    purchase_details.forEach(async (item)=>{
      await item.delete();
    })

    const purchase = await Purchase.findOrFail(params.id)
    await purchase.delete();

    return response.status(200).send({
      'code': '200',
      'status': 'success',
      'message': 'Data berhasil di hapus'
    })
  }

  // Approve
  public async approve({params,response,auth}:HttpContextContract){
    const user = await auth.use('api').user;

    const purchase = await Purchase.findOrFail(params.id)
    purchase.status = 1
    purchase.approved_at = Helper.formatDate(Date.now())
    purchase.approved_by = user.id
    await purchase.save()

    const purchase_details = await PurchaseDetail.query().where('purchase_id', params.id);

    purchase_details.forEach(async (item)=>{
      await this.setStock(item,purchase);
    })

    return response.status(200).send({
      'code': '200',
      'status': 'success',
      'message': 'Data berhasil di approve',
      'result' : purchase,
    })
  }

  // Input Stock
  private async setStock(purchase_detail,purchase){
      let stock = await new Stock();
      let stock_flow = await new StockFlow();

      stock.purchase_id = purchase_detail.purchase_id;
      stock.purchase_detail_id = purchase_detail.id;
      stock.stock_original = purchase_detail.stock
      stock.stock_left = purchase_detail.stock
      stock.product_id = purchase_detail.product_id
      await stock.save()

      stock_flow.stock_id = stock.id
      stock_flow.purchase_detail_id = purchase_detail.id;
      stock_flow.purchase_id = purchase_detail.purchase_id
      stock_flow.product_id = purchase_detail.product_id
      stock_flow.jenis = "purchase"
      stock_flow.number_transaction = purchase.purchase_number
      stock_flow.nominal_purchase = purchase_detail.nominal
      stock_flow.total_purchase = purchase_detail.total
      stock_flow.date = purchase_detail.date
      stock_flow.stock_in = purchase_detail.stock

      await stock_flow.save()
  }
}
