import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import {compose} from "@ioc:Adonis/Core/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import PurchaseDetail from "App/Models/PurchaseDetail";
import SaleDetail from "App/Models/SaleDetail";

export default class Sale extends compose(BaseModel,SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sale_number: string

  @column.date()
  public date: DateTime

  @column()
  public total: number

  @column()
  public user_id: number

  @column()
  public status: number

  @column()
  public approved_by: number

  @column.date()
  public approved_at:DateTime

  @column()
  public customer_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({columnName: 'deleted_at'})
  public deletedAt: DateTime | null

  @hasMany(() => SaleDetail ,{
    foreignKey: 'sale_id',
  })
  public detail: HasMany<typeof SaleDetail>
}
