const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//?////////////////////
//?  POST添加PaidContent
//?////////////////////
exports.addPaidContent = async (req, res) => {
    const { body } = req;
    // console.log("body")
    // console.log(body)
    const text = `INSERT INTO paidcontent 
    (name,appId,price,monetaryUnit)
    VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
        body.name,
        body.appid,
        body.price,
        body.monetaryUnit]
    // console.log(body)
    pool.connect((err, client, release) => {
        // console.log("connected: POST PaidContent")
        if (err) {
            const errMsg = 'POST: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("POST: PaidContent query finished")
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
//?  PUT更新PaidContent
//?////////////////////
exports.updatePaidContent = async (req, res) => {
    const { body } = req;
    const text = `UPDATE paidcontent 
    SET name = $1,
        appId = $2,
        price = $3,
        monetaryUnit = $4
    WHERE id = $5 RETURNING *`;
    const values = [
        body.name,
        body.appid,
        body.price,
        body.monetaryUnit,
        body.id]
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
            // console.log("PaidContent put response data:")
            // console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}

//?////////////////////
//?  DELETE删除PaidContent
//?////////////////////
exports.deletePaidContent = async (req, res) => {
    const text = `DELETE FROM paidcontent WHERE id = $1`;
    const values = [req.params.id]
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
//?  GET获取PaidContent
//?////////////////////
const formatPCInfoForFrontend = async (PC) =>
    PC.map(sub => {
        const name = sub.name;
        const price = sub.price.slice(1, sub.price.length);
        const monetaryUnit = sub.monetaryunit;
        const id = sub.id;
        const appid = sub.appid;
        // console.log(Object.entries(sub.cycle))
        return { id, appid, name, price, monetaryUnit };

    })



exports.queryAllPaidContents = async (req, res) => {
    // console.log("connecting")
    pool.connect((err, client, release) => {
        // console.log("connected")
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query('SELECT * FROM paidcontent ORDER BY appid, id ASC', async (err, result) => {
            // console.log("GET query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log("----------------SUBSCRIPTIONS---------------------")
            const processedData = await formatPCInfoForFrontend(result.rows);
            // console.log("processedData")
            // console.log(processedData)
            res.status(200).json(processedData);
        })
    })
}


