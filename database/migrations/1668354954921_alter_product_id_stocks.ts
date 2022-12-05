import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stocks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('product_id');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
