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

// TODO 其实有个问题: 货币单位不同, 不能直接加, 但是现在(2022-4-15)先不考虑这个问题了

const sumPrice = (list) => {
    return list.reduce((prev, curr) => {
        return prev + Number(curr.price);
    }, 0)
}

const sumPriceByMonth = (list) => {
    let response = new Array(12).fill(0);
    list.forEach(item => {
        response[item.month - 1] += Number(item.price);
    });
    return response;
};


//?////////////////////
//?  GET获取 Total value
//?////////////////////
exports.queryTotalValue = async (req, res) => {
    const apptext = `SELECT price::numeric FROM app INNER JOIN installation
    ON app.id = installation.appid
    WHERE userid = $1
    ORDER BY price ASC`;
    const subtext = `SELECT price::numeric FROM subscription INNER JOIN renewal
    ON subscription.id = renewal.subscriptionid
    WHERE userid = $1
    ORDER BY price ASC`;
    const PCtext = `SELECT price::numeric FROM paidcontent INNER JOIN purchase
    ON paidcontent.id = purchase.paidcontentid
    WHERE userid = $1
    ORDER BY price ASC`;
    const values = [res.locals.user.data.id]
    pool.connect(async (err, client, release) => {
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        try {
            let queryResult, totalValue = 0;

            queryResult = await client.query(apptext, values);
            totalValue += sumPrice(queryResult.rows);
            // console.log("---------------------APP---------------------")
            // console.log(queryResult.rows)
            // console.log("App Sum:")
            // console.log(sumPrice(queryResult.rows))

            queryResult = await client.query(subtext, values);
            totalValue += sumPrice(queryResult.rows);
            // console.log("---------------------SUB---------------------")
            // console.log(queryResult.rows)
            // console.log("Sub Sum:")
            // console.log(sumPrice(queryResult.rows))

            queryResult = await client.query(PCtext, values);
            totalValue += sumPrice(queryResult.rows);
            // console.log("---------------------PC---------------------")
            // console.log(queryResult.rows)
            // console.log("PC Sum:")
            // console.log(sumPrice(queryResult.rows))

            res.status(200).json(totalValue);
        } catch (err) {
            release()
            const errMsg = 'QueryTotalValues: Error executing query'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
    })
}


//?////////////////////
//?  GET获取 monthly cost
//?////////////////////
exports.queryMonthlyCost = async (req, res) => {
    const apptext = `SELECT ROUND(price::numeric,2) AS price, date_part('month', date) AS month FROM app INNER JOIN installation
    ON app.id = installation.appid
    WHERE userid = $1 AND date > date_trunc('year',current_date)::date
    ORDER BY price ASC`;
    const PCtext = `SELECT ROUND(price::numeric,2) AS price, date_part('month', date) AS month FROM paidcontent INNER JOIN purchase
    ON paidcontent.id = purchase.paidcontentid
    WHERE userid = $1 AND date > date_trunc('year',current_date)::date
    ORDER BY price ASC`;
    const subtext = `SELECT price, date_part('month', date) AS month FROM (
    SELECT ROUND(price::numeric,2) AS price, generate_series(startdate::date + '2 day'::interval,date_trunc('year',current_date)::date + INTERVAL '1 year',cycle) AS date 
    FROM subscription INNER JOIN renewal
    ON subscription.id = renewal.subscriptionid
    WHERE userid = $1 ORDER BY price ASC) AS t
    WHERE date >= date_trunc('year',current_date)::date`;
    const values = [res.locals.user.data.id]
    pool.connect(async (err, client, release) => {
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        try {
            let queryResult, totalValue = 0, response = {};

            queryResult = await client.query(apptext, values);
            response.app = sumPriceByMonth(queryResult.rows);
            // console.log("---------------------APP---------------------")
            // console.log(queryResult.rows)
            // console.log("Sum by month:")
            // console.log(sumPriceByMonth(queryResult.rows))
            // console.log("response:")
            // console.log(response)

            queryResult = await client.query(PCtext, values);
            response.paidContent = sumPriceByMonth(queryResult.rows);
            console.log("---------------------PC---------------------")
            console.log(queryResult.rows)
            console.log("Sum by month:")
            console.log(sumPriceByMonth(queryResult.rows))
            console.log("response:")
            console.log(response)

            queryResult = await client.query(subtext, values);
            response.subscription = sumPriceByMonth(queryResult.rows);
            // console.log("---------------------SUB---------------------")
            // console.log(queryResult.rows)
            // console.log("Sum by month:")
            // console.log(sumPriceByMonth(queryResult.rows))
            // console.log("response:")
            // console.log(response)

            res.status(200).json(response);
        } catch (err) {
            release()
            const errMsg = 'QueryTotalValues: Error executing query'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
    })
}