import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sale_details'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('product_id')
    })
  }

  public async down () {

  }
}
