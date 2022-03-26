const { Pool } = require('pg');
var fs = require('fs');
const { resolve } = require('path');

let current = new Date();

const testProfile = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

// Used when Drop/Create DB
const tmpProfile = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_TMP,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}
const pool_tmp = new Pool(tmpProfile);


const initDB = async () => {
    const pool_test = new Pool(testProfile);
    var sql = fs.readFileSync('model\\initDB.sql').toString();
    try {
        await pool_tmp.query(`CREATE DATABASE ${process.env.DB_DATABASE};`);
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
        await pool_tmp.query(`DROP DATABASE IF EXISTS ${process.env.DB_DATABASE};`);
        console.log(`${current.toLocaleTimeString()}: Successfully cleared All databases!`);
        return ('Success');
    } catch (error) {
        console.log(`${current.toLocaleTimeString()}: Clearance Failed!\nError msg:${error.message}`);
        return (error.message);
    }
}

const resetDB = async () => {
    // // * 这里需要有一个Return！
    // return clearDB().then((clear) => {
    //     if (clear === 'Success') {
    //         // console.log('clear = success')
    //         // * 这里需要有一个Return！
    //         return initDB().then((init) => {
    //             if (init === 'Success') {
    //                 console.log(`${current.toLocaleTimeString()}: Reset Successful!`);
    //                 // console.log('init = success')
    //                 return ('Success');
    //             } else {
    //                 console.log(`${current.toLocaleTimeString()}: 1Reset Failed!\nError msg:${init}`);
    //                 return (init);
    //             }
    //         })
    //     } else {
    //         console.log(`${current.toLocaleTimeString()}: 3Reset Failed!\nError msg: ${clear}`);
    //         return (clear);
    //     }
    // })
    // ~ 下面是原来的方法 两个await紧跟着不知道为什么不行， 清空后primary key不会从1开始，而是接着上一次的继续
    // * 其实上面下面两种方法是等价的， 上面的方法很复杂！ 可以看到await真的简化了很多逻辑，
    // * primary key没有清空的原因可能是数据库反应速度的原因，中间需要有一个延迟 
    try {
        const clear = await clearDB();
        await new Promise(resolve => {
            setTimeout(() => {
                resolve('wait a little while...')
            }, 100);
        })
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
    const pool_test = new Pool(testProfile);
    var sql = fs.readFileSync('model\\insertTestData.sql').toString();
    try {
        await pool_test.query(sql);
        pool_test.end();
        // * Better start clean
        //  pool_test.connect((err, client, release) => {
        //     if (err) {
        //         return console.error('Error acquiring client', err.stack)
        //     }
        //     client.query(sql);
        //     release()
        // });
        console.log(`${current.toLocaleTimeString()}: Test data is ready.`);
        return ('Success');
    } catch (error) {
        console.log(error)
        console.log(`${current.toLocaleTimeString()}: Insertion Failed!\nError msg:${error.message}\nDetail:${error.detail}`);
        return (`Error msg:\t${error.message}\nDetail:\t${error.detail}`);
    }
};



module.exports = { clearDB, initDB, resetDB, insertTestData };