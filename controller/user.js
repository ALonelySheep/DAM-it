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
//?  POST添加User
//?////////////////////
exports.addUser = async (req, res) => {
    const text = `INSERT INTO userAccount(id) VALUES ($1)
    ON CONFLICT DO NOTHING RETURNING id;`;
    const values = [res.locals.user.data.id]
    console.log(values)
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