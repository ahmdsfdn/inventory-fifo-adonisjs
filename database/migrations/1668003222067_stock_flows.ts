import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stock_flows'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('stock_id').unsigned()
      table.integer('purchase_detail_id').unsigned()
      table.integer('purchase_id').unsigned()
      table.integer('sale_id').unsigned()
      table.integer('sale_detail_id').unsigned()
      table.integer('product_id').unsigned()
      table.enu('jenis', ['sale', 'purchase'], {
        useNative: true,
        enumName: 'jenis_transaksi',
        existingType: false,
      })
      table.string('number_transaction')
      table.decimal('nominal_sale',8,2)
      table.decimal('total_sale',8,2)
      table.decimal('nominal_purchase',8,2)
      table.decimal('total_purchase',8,2)
      table.dateTime('date', { useTz: true })
      table.integer('stock_in').defaultTo(0)
      table.integer('stock_out').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('purchase_id').references('purchases.id')
      table.foreign('purchase_detail_id').references('purchase_details.id')
      table.foreign('sale_id').references('sales.id')
      table.foreign('sale_detail_id').references('sale_details.id')
      table.foreign('stock_id').references('stocks.id')
      table.foreign('product_id').references('products.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
