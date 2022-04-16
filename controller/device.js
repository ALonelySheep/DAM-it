const { Pool } = require('pg')

let connectInfo;
if (process.env.NODE_ENV === 'production')
    connectInfo = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
else
    connectInfo = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    }

const pool = new Pool(connectInfo);

//?////////////////////
//?  POST添加Device
//?////////////////////
exports.addDevice = async (req, res) => {
    const { body } = req;
    // console.log(res.locals.user.data.id)
    // console.log("Add Device: body")
    // console.log(body)
    const text = `INSERT INTO device 
    (name, userid, model, storage)
    VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
        body.name,
        res.locals.user.data.id,
        body.model,
        body.storage]
    pool.connect((err, client, release) => {
        // console.log("connected: POST APP")
        if (err) {
            const errMsg = 'POST: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("POST: query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query: POST'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}

//?////////////////////
//?  PUT更新Device
//?////////////////////
exports.updateDevice = async (req, res) => {
    const { body } = req;
    const text = `UPDATE device 
    SET name = $1,
        model = $2,
        storage = $3
    WHERE id = $4 AND userid = $5 RETURNING *`;
    const values = [
        body.name,
        body.model,
        body.storage,
        body.id,
        res.locals.user.data.id]
    pool.connect((err, client, release) => {
        // console.log("connected: PUT Device")
        if (err) {
            const errMsg = 'PUT: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("PUT APP: query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query: PUT'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}
//?////////////////////
//?  DELETE删除Device
//?////////////////////
exports.deleteDevice = async (req, res) => {
    const text = `DELETE FROM device WHERE id = $1 AND userid = $2`;
    const values = [req.params.id, res.locals.user.data.id]
    pool.connect((err, client, release) => {
        // console.log("DELETE Device: connected")
        if (err) {
            const errMsg = 'DELETE Device: Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("'DELETE Device: query finished")
            release()
            if (err) {
                const errMsg = 'DELETE Device: Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log(result)
            res.status(200).send();
        })
    })
}
//?////////////////////
//?  GET获取Device
//?////////////////////

exports.queryAllDevices = async (req, res) => {
    // console.log(res.locals)
    const text = `SELECT * FROM device
    WHERE userid = $1
    ORDER BY id ASC`;
    const values = [res.locals.user.data.id]
    pool.connect((err, client, release) => {
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            release()
            if (err) {
                const errMsg = 'Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }

            res.status(200).json(result.rows);
        })
    })
}
