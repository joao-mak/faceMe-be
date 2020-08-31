const { DB_URL, NODE_ENV } = process.env;
const environment = NODE_ENV || 'development';

console.log(process.env.DB_URL, NODE_ENV);

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfig = {
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  development: {
    connection: {
      database: 'faceme',
      username: 'joao',
      password: 'password',
    },
  },
  test: {
    connection: {
      database: 'faceme_test',
      username: 'joao',
      password: 'password',
    },
  },
};

module.exports = { ...customConfig[environment], ...baseConfig };
