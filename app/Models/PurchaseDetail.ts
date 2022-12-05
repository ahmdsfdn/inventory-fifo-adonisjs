import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import {compose} from "@ioc:Adonis/Core/Helpers";

export default class PurchaseDetail extends compose(BaseModel,SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public purchase_id: number

  @column()
  public user_id: number

  @column()
  public stock: number

  @column()
  public nominal: number

  @column()
  public total: number

  @column()
  public product_id: number

  @column.dateTime()
  public date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime
}
