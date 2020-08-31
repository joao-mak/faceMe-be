const { userData, loginData } = require('../data/index.js');

exports.seed = (knex) => {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex('users').insert(userData);
    })
    .then(() => {
      return knex('login').insert(loginData);
    });
};
