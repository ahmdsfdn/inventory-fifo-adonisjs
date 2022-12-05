import { DateTime } from 'luxon'
import {
  BaseModel, column, Has, hasMany,
  HasMany, HasOne, belongsTo, BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import PurchaseDetail  from "App/Models/PurchaseDetail";
import StockFlow from "App/Models/StockFlow";
import Stock from "App/Models/Stock";
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers";
import Supplier from "App/Models/Supplier";

export default class Purchase extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public purchase_number: string

  @column.date()
  public date: DateTime

  @column()
  public total: Number

  @column()
  public user_id: Number

  @column()
  public supplier_id: Number

  @column()
  public status: Number

  @column()
  public approved_by: Number

  @column.date()
  public approved_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  public deletedAt: DateTime

  @hasMany(() => PurchaseDetail ,{
    foreignKey: 'purchase_id',
  })
  public detail: HasMany<typeof PurchaseDetail>

  @hasMany(()=>StockFlow, {
    foreignKey: 'purchase_id',
  })
  public stockFlowDetail: HasMany<typeof StockFlow>

  @hasMany(()=>Stock, {
    foreignKey: 'purchase_id',
  })
  public stockDetail: HasMany<typeof Stock>

  @belongsTo(() => Supplier, {
    foreignKey: 'supplier_id',
  })
  public supplier: BelongsTo<typeof Supplier>
}
