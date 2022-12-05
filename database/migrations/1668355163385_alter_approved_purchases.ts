import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('status').nullable().defaultTo(0);
      table.integer('approved_by').nullable();
      table.dateTime('approved_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('approved_by').references('users.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
