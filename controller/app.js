const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const appList = [
    {
        id: 1,
        name: "backend App A",
    },
    {
        id: 2,
        name: "backend App B",
    }
]


//?////////////////////
//?  POST添加App
//?////////////////////
exports.addApp = async (req, res) => {
    const { body } = req;
    const { name } = body;

    const newApp = {
        id: appList.length + 1,
        name
    };

    appList.push(newApp);

    res.json(newApp);
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

        //? Date formatting
        // let billingCycleString = '';
        // for (const [key, value] of Object.entries(app.cycle)) {
        //     billingCycleString += `${value} ${key.charAt(0).toUpperCase() + key.slice(1)} `;
        // }
        // billingCycleString = billingCycleString.trim()

        return { id, name, price, monetaryUnit };

    })
exports.queryAllApps = async (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            const errMsg = 'Error acquiring client'
            res.status(500).json(errMsg);
            return console.error(errMsg, err.stack)
        }
        client.query('SELECT * FROM app', async (err, result) => {
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



// exports.getAllApps = async (req, res) => {
//     res.json(appList);
// }

// exports.getApp = async (req, res) => {
//     // TODO Finish this!
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