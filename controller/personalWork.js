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
//?  POST添加PersonalWork
//?////////////////////
exports.addPersonalWork = async (req, res) => {
    const { body } = req;
    // console.log("body")
    // console.log(body)
    const text = `INSERT INTO work 
    (name,userid,deviceid,copyright,category)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const values = [
        body.name,
        res.locals.user.data.id,
        body.deviceid,
        body.copyright,
        body.category]
    // console.log(values)
    pool.connect((err, client, release) => {
        // console.log("connected: POST PersonalWork")
        if (err) {
            const errMsg = 'POST: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("POST: PersonalWork query finished")
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
//?  PUT更新PersonalWork
//?////////////////////
exports.updatePersonalWork = async (req, res) => {
    const { body } = req;
    const text = `UPDATE work 
    SET name = $1,
        deviceid = $2,
        copyright = $3,
        category = $4
    WHERE id = $5 AND userid = $6 RETURNING *`;
    const values = [
        body.name,
        body.deviceid,
        body.copyright,
        body.category,
        body.id,
        res.locals.user.data.id]
    pool.connect((err, client, release) => {
        // console.log("connected: PUT")
        if (err) {
            const errMsg = 'PUT: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("PUT: query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query: PUT'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log("PersonalWork put response data:")
            // console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}

//?////////////////////
//?  DELETE删除PersonalWork
//?////////////////////
exports.deletePersonalWork = async (req, res) => {
    const text = `DELETE FROM work WHERE id = $1 AND userid = $2`;
    const values = [req.params.id, res.locals.user.data.id]
    pool.connect((err, client, release) => {
        // console.log("DELETE: connected")
        if (err) {
            const errMsg = 'DELETE: Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("'DELETE: query finished")
            release()
            if (err) {
                const errMsg = 'DELETE: Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log(result)
            res.status(200).send();
        })
    })
}



//?////////////////////
//?  GET获取PersonalWork
//?////////////////////

exports.queryAllPersonalWorks = async (req, res) => {
    // console.log(res.locals.user.data.id)
    // console.log("connecting")
    const text = `SELECT * FROM work 
    WHERE userid = $1
    ORDER BY deviceid, id ASC`;
    const values = [res.locals.user.data.id]
    pool.connect((err, client, release) => {
        // console.log("connected")
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("GET query finished")
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


