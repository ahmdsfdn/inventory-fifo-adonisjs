import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sale_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sale_id').unsigned()
      table.integer('user_id').unsigned()
      table.integer('stock')
      table.decimal('nominal', 8, 2)
      table.decimal('total', 8, 2)
      table.dateTime('date', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('sale_id').references('sales.id')
      table.foreign('user_id').references('users.id')
    })
  }



  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
