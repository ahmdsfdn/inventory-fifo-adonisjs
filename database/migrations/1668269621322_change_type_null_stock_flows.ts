import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stock_flows'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sale_id').nullable().alter();
      table.integer('sale_detail_id').nullable().alter();
      table.integer('purchase_detail_id').nullable().alter();
      table.integer('purchase_id').nullable().alter();
    })
  }

  public async down () {

  }
}
