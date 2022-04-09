const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// TODO Add Monetary Unit and App id to be coherent with DB
const subscriptionList = [
    [
        {
            name: "Backend Subscription A",
            data: { cycle: '1 Year', price: '300 USD' },
        },
        {
            name: "Backend Subscription B",
            data: { cycle: '1 Month', price: '200 CHY' },
        }
    ],
    [
        {
            name: "Backend Subscription C",
            data: { cycle: '2 Weeks', price: '30 CAD' },
        },
        {
            name: "Backend Subscription D",
            data: { cycle: '3 Days', price: 'Free' },
        }
    ]
]


//?////////////////////
//?  POST添加Subscription
//?////////////////////
exports.addSubscription = async (req, res) => {
    const { body } = req;
    const { name, data } = body;

    const newsubscription = {
        name,
        data
    };

    subscriptionList[0].push(newsubscription);
    console.log(subscriptionList);
    res.json(newsubscription);
}


//?////////////////////
//?  GET获取Subscription
//?////////////////////
const formatSubsInfo = async (subs) =>
    subs.map(sub => {
        const name = sub.name;
        const price = sub.price.slice(1, sub.price.length);
        const monetaryUnit = sub.monetaryunit;
        const startDate = new Date(sub.startdate);
        const [billingCycleUnit, billingCycle] = Object.entries(sub.cycle)[0]
        const autoRenewal = sub.autorenewal;
        const id = sub.id;
        const appid = sub.appid;

        //? Date formatting
        // let billingCycleString = '';
        // for (const [key, value] of Object.entries(sub.cycle)) {
        //     billingCycleString += `${value} ${key.charAt(0).toUpperCase() + key.slice(1)} `;
        // }
        // billingCycleString = billingCycleString.trim()

        return { id, appid, name, price, monetaryUnit, startDate, billingCycle, billingCycleUnit, autoRenewal };

    })



exports.queryAllSubscriptions = async (req, res) => {
    console.log("connecting")
    pool.connect((err, client, release) => {
        console.log("connected")
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query('SELECT * FROM subscription ORDER BY appid ASC', async (err, result) => {
            console.log("query finished")
            release()
            if (err) {
                const errMsg = 'Error executing query'
                res.status(500).json(errMsg);
                return console.error(errMsg, err.stack)
            }
            // console.log("----------------SUBSCRIPTIONS---------------------")
            const processedData = await formatSubsInfo(result.rows);
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