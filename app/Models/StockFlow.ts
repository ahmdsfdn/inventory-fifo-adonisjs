import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class StockFlow extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public stock_id: number

  @column()
  public purchase_detail_id: number

  @column()
  public purchase_id: number

  @column()
  public sale_id: number

  @column()
  public sale_detail_id: number

  @column()
  public product_id: number

  @column()
  public jenis: string

  @column()
  public number_transaction: string

  @column()
  public nominal_sale: number

  @column()
  public total_sale: number

  @column()
  public nominal_purchase: number

  @column()
  public total_purchase: number

  @column.dateTime()
  public date: DateTime

  @column()
  public stock_in: number

  @column()
  public stock_out: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName:'deleted_at' })
  public deletedAt: DateTime

}
