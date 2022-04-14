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
    const text = `INSERT INTO purchase (userId,paidcontentid)
    VALUES ($1, getPCId($2::varchar(40),$3,$4::money,$5::varchar(10))) RETURNING *`;
    const values = [
        // Get user id
        res.locals.user.data.id,
        // Get subscription id
        body.name,
        body.appid,
        body.price,
        body.monetaryUnit]
    // const text = `INSERT INTO paidcontent
    // (name,appId,price,monetaryUnit)
    // VALUES ($1,$2,$3,$4) RETURNING *`;
    // const values = [
    //     body.name,
    //     body.appid,
    //     body.price,
    //     body.monetaryUnit]
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
    console.log(body)
    const text = `UPDATE purchase
    SET paidcontentid = PaidCont.pcid,
        userid = $1
    FROM (SELECT * FROM getPCId($2::varchar(40),$3,$4::money,$5::varchar(10)))
    AS PaidCont
    WHERE id = $6 RETURNING *`
    const values = [
        // Get user id
        res.locals.user.data.id,
        // Get subscription id
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
            console.log("PaidContent put response data:")
            console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}

//?////////////////////
//?  DELETE删除PaidContent
//?////////////////////
exports.deletePaidContent = async (req, res) => {
    const text = `DELETE FROM purchase WHERE id = $1`;
    const values = [req.params.id]
    pool.connect(async (err, client, release) => {
        // console.log("DELETE: connected")
        if (err) {
            const errMsg = 'DELETE: Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        try {
            const deletePurchaseResult = await client.query(text, values);
            await client.query('DELETE FROM paidcontent pc WHERE NOT EXISTS (select 1 from purchase p where pc.id = p.paidcontentid)');
            console.log(deletePurchaseResult.rows)
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
//?  GET获取PaidContent
//?////////////////////
const formatPCInfoForFrontend = async (PC) =>
    PC.map(sub => {
        const price = sub.price.slice(1, sub.price.length);
        return {
            id: sub.id,
            appid: sub.appid,
            name: sub.name,
            price,
            monetaryUnit: sub.monetaryunit
        };
    })

exports.queryAllPaidContents = async (req, res) => {
    // console.log("connecting")
    const text = `SELECT
        purchase.id AS id,
        appid,
        name,
        price,
        monetaryunit
    FROM paidcontent INNER JOIN purchase
    ON paidcontent.id = purchase.paidcontentid
    WHERE userid = $1
    ORDER BY appid, purchase.id ASC`;
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
            // console.log(result.rows)
            // console.log("----------------SUBSCRIPTIONS---------------------")
            const processedData = await formatPCInfoForFrontend(result.rows);
            // console.log("processedData")
            // console.log(processedData)
            res.status(200).json(processedData);
        })
    })
}


