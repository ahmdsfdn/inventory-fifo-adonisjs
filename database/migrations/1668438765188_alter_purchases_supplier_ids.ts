import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('supplier_id').nullable();
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('supplier_id').references('suppliers.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
