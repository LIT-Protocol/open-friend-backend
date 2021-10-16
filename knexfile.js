// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: process.env.LIT_OPEN_FRIEND_BACKEND_DB_URL,
    migrations: {
      tableName: "knex_migrations",
    },
  },
  staging: {
    client: "pg",
    connection: process.env.LIT_OPEN_FRIEND_BACKEND_DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "pg",
    connection: process.env.LIT_OPEN_FRIEND_BACKEND_DB_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
