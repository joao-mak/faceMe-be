exports.up = (knex) => {
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.increments('user_id');
    usersTable.text('user_name').notNullable();
    usersTable.text('user_email').unique().notNullable();
    usersTable.integer('entries').defaultTo(0);
    usersTable.timestamp('joined').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
