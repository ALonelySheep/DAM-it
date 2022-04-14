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
    //name,appId,price,monetaryUnit,cycle
    const text = `INSERT INTO renewal
    (userId,subscriptionId,startDate,autoRenewal)
    VALUES ($6,
    getSubId($1::varchar(40),$2,$3::money,$4::varchar(10),$5::interval),
    $7,$8) RETURNING *`;
    const values = [
        // Get subscription id
        body.name,
        body.appid,
        body.price,
        body.monetaryUnit,
        body.cycle,
        // Get user id
        res.locals.user.data.id,
        // startDate and autoRenewal
        body.startDate,
        body.autoRenewal]
    // console.log(body)

    pool.connect((err, client, release) => {
        console.log("connected: POST Subscription")
        if (err) {
            const errMsg = 'POST: error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query(text, values, async (err, result) => {
            console.log("POST: Subscription query finished")
            release()
            if (err) {
                console.log("POST: Error executing query")
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
// * getSubId may cause orphan subscription, we delete them in delete subscription
exports.updateSubscription = async (req, res) => {
    const { body } = req;
    const text = `
    UPDATE renewal
    SET subscriptionId = sub.SubId,
        startDate = $6,
        autoRenewal = $7
    FROM (SELECT * FROM getSubId($1::varchar(40),$2,$3::money,$4::varchar(10),$5::interval)) AS sub
    WHERE id = $8 RETURNING *`
    const values = [
        body.name,
        body.appid,
        body.price,
        body.monetaryUnit,
        body.cycle,
        body.startDate,
        body.autoRenewal,
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
            // console.log("Subscription put response data:")
            // console.log(result.rows)
            res.status(200).json(result.rows);
        })
    })
}


//?////////////////////
//?  DELETE删除Subscription
//?////////////////////
//* 其实Delete的是Renewal, 只有在一个sub没有被任何renewal引用的时候才会删除它,同时注意这里还清理了因为update产生的无引用sub
exports.deleteSubscription = async (req, res) => {
    const text = `DELETE FROM renewal WHERE id = $1;`;
    const values = [req.params.id]
    pool.connect(async (err, client, release) => {
        // console.log("DELETE: connected")
        if (err) {
            const errMsg = 'DELETE: Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        try {
            const deleteRenewalResult = await client.query(text, values);
            await client.query('DELETE FROM Subscription s WHERE  NOT EXISTS (select 1 from renewal r where s.id = r.subscriptionid )');
            console.log(deleteRenewalResult.rows)
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
//?  GET获取Subscription
//?////////////////////
const formatSubsInfoForFrontend = async (subs) =>
    subs.map(sub => {
        //? Date formatting: Billing Cycle
        //? 1. only 1 time unit
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

        return {
            id: sub.id,
            subscriptionid: sub.subscriptionid,
            appid: sub.appid,
            name: sub.name,
            price: sub.price.slice(1, sub.price.length),
            monetaryUnit: sub.monetaryunit,
            startDate: new Date(sub.startdate),
            billingCycle,
            billingCycleUnit,
            autoRenewal: sub.autorenewal
        };

    })



exports.queryAllSubscriptions = async (req, res) => {
    const text = `SELECT
        renewal.id AS id,
        subscriptionid,
        appid,
        name,
        price,
        monetaryunit,
        startdate,
        cycle,
        autorenewal
    FROM subscription INNER JOIN renewal
    ON subscription.id = renewal.subscriptionid
    WHERE userid = $1
    ORDER BY appid, renewal.id ASC`;
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
            const processedData = await formatSubsInfoForFrontend(result.rows);
            // console.log(result.rows)
            // console.log("----------------SUBSCRIPTIONS---------------------")
            // console.log("processedData")
            // console.log(processedData)
            res.status(200).json(processedData);
        })
    })
}

