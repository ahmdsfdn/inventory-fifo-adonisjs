import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stocks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('purchase_id').unsigned()
      table.integer('purchase_detail_id').unsigned()
      table.integer('stock_original').defaultTo(0)
      table.integer('stock_left').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('purchase_id').references('purchases.id')
      table.foreign('purchase_detail_id').references('purchase_details.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
