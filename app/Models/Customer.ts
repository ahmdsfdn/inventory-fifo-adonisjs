import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import { compose } from '@ioc:Adonis/Core/Helpers'

export default class Customer extends compose(BaseModel,SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({columnName: 'deleted_at'})
  public deletedAt: DateTime | null
}
