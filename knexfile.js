const ENV = 'development';

const config = {
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'faceme_test',
      username: 'joao',
      password: 'password',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'faceme',
      username: 'joao',
      password: 'password',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};

module.exports = config[ENV];
