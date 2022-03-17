const { Pool } = require('pg');
var fs = require('fs');

let current = new Date();

const pool_test = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Used when Drop/Create DB
const pool_tmp = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_TMP,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const initDB = async () => {
    var sql = fs.readFileSync('model\\initDB.sql').toString();
    try {
        await pool_tmp.query('CREATE DATABASE dam_db;');
        await pool_test.query(sql);
        console.log(`${current.toLocaleTimeString()}: Successfully initiated All databases!`);
        return ('Success');
    } catch (error) {
        console.log(`${current.toLocaleTimeString()}: Initiation Failed!\nError msg:${error.message}`);
        return (error.message);
    }
}

const clearDB = async () => {
    try {
        await pool_tmp.query('DROP DATABASE IF EXISTS dam_db;');
        console.log(`${current.toLocaleTimeString()}: Successfully cleared All databases!`);
        return ('Success');
    } catch (error) {
        console.log(`${current.toLocaleTimeString()}: Clearance Failed!\nError msg:${error.message}`);
        return (error.message);
    }
}

const resetDB = async () => {
    try {
        const clear = await clearDB();
        const init = await initDB();
        if (clear === 'Success' && init === 'Success') {
            console.log(`${current.toLocaleTimeString()}: Reset Successful!`);
            return ('Success');
        }
        else {
            console.log(`${current.toLocaleTimeString()}: Reset Failed!\nError msg: clear: ${clear}\ninit: ${init}`);
            return (`clear: ${clear}\ninit: ${init}`);
        }
    } catch (error) {
        console.log(`${current.toLocaleTimeString()}: Reset Failed!\nError msg:${error.message}`);
        return (error.message);
    }
}

const insertTestData = async () => {
    var sql = fs.readFileSync('model\\insertTestData.sql').toString();
    try {
        await pool_test.query(sql);
        console.log(`${current.toLocaleTimeString()}: Test data is ready.`);
        return ('Success');
    } catch (error) {
        console.log(error)
        console.log(`${current.toLocaleTimeString()}: Insertion Failed!\nError msg:${error.message}`);
        return (error.message);
    }
};



module.exports = { clearDB, initDB, resetDB, insertTestData };