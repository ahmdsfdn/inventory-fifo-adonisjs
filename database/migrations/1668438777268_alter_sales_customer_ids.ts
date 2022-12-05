import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('customer_id').nullable();
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('customer_id').references('customers.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
