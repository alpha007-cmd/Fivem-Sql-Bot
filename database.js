
const mariadb = require('mariadb');
const { db_host, db_port, db_user, db_password, db_database } = require('./config.json');

const pool = mariadb.createPool({
    host: db_host,
    port: db_port,
    user: db_user,
    password: db_password,
    database: db_database,
    connectionLimit: 5, 
    connectTimeout: 10000, 
    charset: 'utf8mb4',
});

module.exports = {
    pool,
};
