const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//?////////////////////
//?  POST添加Subscription
//?////////////////////
exports.addSubscription = async (req, res) => {
    const { body } = req;
    // console.log("body")
    // console.log(body)
    const text = `INSERT INTO subscription 
    (name,appId,price,cycle,monetaryUnit,startDate,autoRenewal)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const values = [
        body.name,
        body.appid,
        body.price,
        body.cycle,
        body.monetaryUnit,
        body.startDate,
        body.autoRenewal]
    // console.log(body)
    pool.connect((err, client, release) => {
        // console.log("connected: POST Subscription")
        if (err) {
            const errMsg = 'POST: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            // console.log("POST: Subscription query finished")
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
//?  PUT更新Subscription
//?////////////////////
exports.updateSubscription = async (req, res) => {
    const { body } = req;
    const text = `UPDATE subscription 
    SET name = $1,
        appId = $2,
        price = $3,
        cycle = $4,
        monetaryUnit = $5,
        startDate = $6,
        autoRenewal = $7
    WHERE id = $8 RETURNING *`;
    const values = [
        body.name,
        body.appid,
        body.price,
        body.cycle,
        body.monetaryUnit,
        body.startDate,
        body.autoRenewal,
        body.id]
    pool.connect((err, client, release) => {
        console.log("connected: PUT")
        if (err) {
            const errMsg = 'PUT: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            console.log("PUT: query finished")
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
//?  DELETE删除Subscription
//?////////////////////
exports.deleteSubscription = async (req, res) => {
    const text = `DELETE FROM subscription WHERE id = $1`;
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
//?  GET获取Subscription
//?////////////////////
const formatSubsInfoForFrontend = async (subs) =>
    subs.map(sub => {
        const name = sub.name;
        const price = sub.price.slice(1, sub.price.length);
        const monetaryUnit = sub.monetaryunit;
        const startDate = new Date(sub.startdate);
        const autoRenewal = sub.autorenewal;
        const id = sub.id;
        const appid = sub.appid;

        //? Date formatting: Billing Cycle
        //? 1. only 1 time uint
        //? 2. convert days to weeks if possible
        let billingCycle, billingCycleUnit;
        if (Object.entries(sub.cycle).length !== 1) {
            const arr = Object.entries(sub.cycle);
            if (arr.length !== 2 || arr[0][0] !== 'years') {
                console.error('Error: invalid inverval format');
                [billingCycleUnit, billingCycle] = Object.entries(sub.cycle)[0]
            } else {
                billingCycle = arr[0][1] * 12 + arr[1][1];
                billingCycleUnit = arr[1][0];
            }
        } else {
            [billingCycleUnit, billingCycle] = Object.entries(sub.cycle)[0]
        }
        if (billingCycleUnit === 'days' && billingCycle % 7 === 0
            && billingCycle / 7 < 20
        ) {
            billingCycle = billingCycle / 7;
            billingCycleUnit = 'weeks';
        }
        // console.log(Object.entries(sub.cycle))
        return { id, appid, name, price, monetaryUnit, startDate, billingCycle, billingCycleUnit, autoRenewal };

    })



exports.queryAllSubscriptions = async (req, res) => {
    // console.log("connecting")
    pool.connect((err, client, release) => {
        // console.log("connected")
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query('SELECT * FROM subscription ORDER BY appid, id ASC', async (err, result) => {
            // console.log("GET query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log("----------------SUBSCRIPTIONS---------------------")
            const processedData = await formatSubsInfoForFrontend(result.rows);
            // console.log("processedData")
            // console.log(processedData)
            res.status(200).json(processedData);
        })
    })
}

// router.get("/", );
// exports.getAllSubscriptions = async (req, res) => {
//     res.json(subscriptionList);
//     // console.log(result)
//     res.json(result);
// }

// exports.getSubscription = async (req, res) => {
//     const { id } = req.params;

//     // Find the restaurant with the matching id.
//     const book = ALL_BOOKS.find((book) => book.id === id);

//     // If the restaurant doesn't exist, let the client know.
//     if (!book) {
//         res.sendStatus(404);
//         return;
//     }

//     res.json(book);
// }


