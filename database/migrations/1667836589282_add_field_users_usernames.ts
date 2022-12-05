import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable('users', (table) => {
      table.string('username')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
