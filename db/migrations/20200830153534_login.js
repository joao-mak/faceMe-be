exports.up = (knex) => {
  return knex.schema.createTable('login', (loginTable) => {
    loginTable.increments('login_id');
    loginTable
      .text('login_email')
      .references('users.user_email')
      .notNullable()
      .onDelete('CASCADE');
    loginTable.text('login_hash').notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('login');
};
