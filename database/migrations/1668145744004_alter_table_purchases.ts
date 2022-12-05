import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('user_id')
    })
  }

  public async down () {

  }
}
