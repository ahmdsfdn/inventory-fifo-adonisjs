import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ReportsController {
  public async history_report({request, params, response}: HttpContextContract){
    const report = await Database.rawQuery(
      `SELECT *,(SELECT array_to_json(array_agg(dt)) FROM (SELECT * FROM stock_flows WHERE stock_flows.product_id = products.id ORDER BY date DESC) as dt) as data_fifo FROM products where deleted_at is null`
    )

    return response.status(200).send({
      'code' : '200',
      'message' : 'Data berhasil diambil',
      'status' : 'success',
      'result' : report.rows
    })
  }

  public async summary_stock({request, params, response}: HttpContextContract) {
    const summary = await Database.rawQuery(
      `SELECT stocks.*,SUM(stock_left) as stok_final FROM stocks GROUP BY stocks.id,stocks.product_id`
    )

    return response.status(200).send({
      'code' : '200',
      'message' : 'Data berhasil diambil',
      'status' : 'success',
      'result' : summary.rows
    })
  }
}
