import { Dialect } from 'sequelize';

const config = {
  development: {
    socketPath: '/var/run/mysqld/mysqld.sock',
    username: 'root',
    password: 'password',
    database: 'database_development',
    host: '127.0.0.1',
    dialect: 'mysql' as Dialect,
  },
  test: {
    socketPath: '/var/run/mysqld/mysqld.sock',
    username: 'root',
    password: 'hardhdd',
    database: 'look',
    host: '192.168.12.159',
    dialect: 'mysql' as Dialect,
  },
  production: {
    socketPath: '/var/run/mysqld/mysqld.sock',
    username: 'root',
    password: 'password',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql' as Dialect,
  },
};

export default config;
