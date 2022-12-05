import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {compose} from "@ioc:Adonis/Core/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class SaleDetail extends compose(BaseModel,SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sale_id: number

  @column()
  public user_id: number

  @column()
  public stock: number

  @column()
  public nominal: number

  @column()
  public total: number

  @column.date()
  public date: DateTime

  @column()
  public product_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime
}
