// const formidable = require('formidable');
// const { fieldValidator } = require('../utils/index');

const pool = require('../model/db');
const { initDB, clearDB, resetDB, insertTestData} = require('../model/db-test');

// exports.getAll = async (req, res) => {
//     pool.query('SELECT * FROM t1 ORDER BY c1 ASC', (error, results) => {
//         if (error) {
//             throw error
//         }
//         res.status(200).json(results.rows)
//     })
// }

// exports.getCol = async (req, res) => {
//     pool.query(`SELECT * FROM t1 WHERE c1=${req.params.c1}`, (error, results) => {
//         if (error) {
//             throw error
//         }
//         res.status(200).json(results.rows)
//     })
// }

exports.clearDB = async (req, res) => {
    const result = await clearDB();
    // console.log(result);
    if (result === 'Success') {
        res.status(200).send(result);
    } else {
        res.status(500).send(result);
    }
}

exports.initDB = async (req, res) => {
    const result = await initDB();
    // console.log('result', result);
    if (result === "Success") {
        res.status(200).send(result);
    } else {
        res.status(500).send(result);
    }
}

exports.resetDB = async (req, res) => {
    const result = await resetDB();
    // console.log('result', result);
    if (result === "Success") {
        res.status(200).send(result);
    } else {
        res.status(500).send(result);
    }
}

exports.insertTestData = async (req, res) => {
    const result = await insertTestData();
    if (result === "Success") {
        res.status(200).send(result);
    } else {
        res.status(500).send(result);
    }
}

