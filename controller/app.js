const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


// const appList = [
//     {
//         id: 1,
//         name: "backend App A",
//     },
//     {
//         id: 2,
//         name: "backend App B",
//     }
// ]


//?////////////////////
//?  POST添加App
//?////////////////////
exports.addApp = async (req, res) => {
    const { body } = req;
    console.log("Add App: body")
    console.log(body)
    const text = `INSERT INTO app 
    (name, price, monetaryUnit)
    VALUES ($1,$2,$3) RETURNING *`;
    const values = [
        body.name,
        body.price,
        body.monetaryUnit]
    pool.connect((err, client, release) => {
        console.log("connected: POST APP")
        if (err) {
            const errMsg = 'POST: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            console.log("POST: query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query: POST'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}

//?////////////////////
//?  PUT更新App
//?////////////////////
exports.updateApp = async (req, res) => {
    const { body } = req;
    const text = `UPDATE app 
    SET name = $1,
        price = $2,
        monetaryUnit = $3
    WHERE id = $4 RETURNING *`;
    const values = [
        body.name,
        body.price,
        body.monetaryUnit,
        body.id]
    pool.connect((err, client, release) => {
        console.log("connected: PUT App")
        if (err) {
            const errMsg = 'PUT: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            console.log("PUT APP: query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query: PUT'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}
//?////////////////////
//?  DELETE删除App
//?////////////////////
exports.deleteApp = async (req, res) => {
    const text = `DELETE FROM app WHERE id = $1`;
    const values = [req.params.id]
    pool.connect((err, client, release) => {
        console.log("DELETE App: connected")
        if (err) {
            const errMsg = 'DELETE App: Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            console.log("'DELETE App: query finished")
            release()
            if (err) {
                const errMsg = 'DELETE App: Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log(result)
            res.status(200).send();
        })
    })
}
//?////////////////////
//?  GET获取App
//?////////////////////
const formatAppinfo = async (apps) =>
    apps.map(app => {
        const id = app.id;
        const name = app.name;
        const price = app.price.slice(1, app.price.length);
        const monetaryUnit = app.monetaryunit;
        return { id, name, price, monetaryUnit };
    })

exports.queryAllApps = async (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query('SELECT * FROM app ORDER BY id ASC', async (err, result) => {
            release()
            if (err) {
                const errMsg = 'Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log("---------------------APP---------------------")
            const processedData = await formatAppinfo(result.rows);
            // console.log(processedData)
            res.status(200).json(processedData);
        })
    })
}
