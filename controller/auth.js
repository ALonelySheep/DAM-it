const jwt = require('jsonwebtoken');

exports.authorizeRequest = (req, res, next) => {
    // console.log(req.headers.authorization);
    try {
        let decoded = jwt.verify(req.headers.authorization, process.env.AUTH_APP_SECRET),
            expired = Date.parse(new Date()) / 1000 > decoded.exp;
        // console.log("decoded")
        if (expired) {
            // 过期
            console.log('token expired');
            res.status(401).json('User token expired')
        } else {
            // 合法也没过期，正常放行
            // // console.log("Authorized");
            // console.log("UserID");
            // console.log(decoded.data.id);
            res.locals.user = decoded;
            next();
        }
    } catch (error) {
        // 不合法
        res.status(401).json('Illegal user token')
    }
}