const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//?////////////////////
//?  POST添加App
//?////////////////////
exports.addApp = async (req, res) => {
    const { body } = req;
    console.log(body)
    // console.log("Add App: body")
    // console.log(body)
    const text = `INSERT INTO installation (userId,appId)
    VALUES ($1, getAppId($2::varchar(40),$3::money,$4::varchar(10)))   RETURNING *`;
    const values = [
        // Get user id
        res.locals.user.data.id,
        // Get subscription id
        body.name,
        body.price,
        body.monetaryUnit]
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
//?  PUT更新App
//?////////////////////
exports.updateApp = async (req, res) => {
    const { body } = req;
    const text = `UPDATE installation
    SET appId = app.appId,
        userId = $1
    FROM (SELECT * FROM getAppId($2::varchar(40),$3::money,$4::varchar(10))) 
    AS app
    WHERE id = $5 RETURNING *`
    const values = [
        res.locals.user.data.id,
        body.name,
        body.price,
        body.monetaryUnit,
        body.id]
    pool.connect((err, client, release) => {
        // console.log("connected: PUT App")
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
            console.log("APP UPDATE")
            console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}
//?////////////////////
//?  DELETE删除App
//?////////////////////
exports.deleteApp = async (req, res) => {
    const text = `DELETE FROM installation WHERE id = $1`;
    const values = [req.params.id]
    pool.connect(async (err, client, release) => {
        // console.log("DELETE App: connected")
        if (err) {
            const errMsg = 'DELETE App: Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        try {
            const deleteInstallationResult = await client.query(text, values);
            await client.query('DELETE FROM App app WHERE NOT EXISTS (select 1 from installation ins where app.id = ins.appId)');
            console.log(deleteInstallationResult.rows)
            res.status(200).send();
        } catch (err) {
            release()
            const errMsg = 'DELETE: Error executing query'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
    })
}
//?////////////////////
//?  GET获取App
//?////////////////////

exports.queryAllApps = async (req, res) => {
    const text = `SELECT
        installation.id AS id,
        app.id AS appid,
        name,
        price::numeric,
        monetaryunit,
        date
    FROM app INNER JOIN installation
    ON app.id = installation.appid
    WHERE userid = $1
    ORDER BY appid ASC`;
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
            // console.log("---------------------APP---------------------")
            // console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}
