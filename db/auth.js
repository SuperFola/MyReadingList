require("dotenv").config()

const codes = require("../httpcodes")
const crypto = require("crypto")

module.exports = {
    isAuthorized: async (req, _, next) => {
        const db = req.app.get("db")("users")

        if (req.headers.authorization) {
            const auth = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':')
            const user = auth[0]
            const hash = auth[1]

            const rows = await db.select("users", val => val.name === user)

            if (rows.length === 1 && rows[0]["pass"] === hash) {
                req.session.user = user
            }

            return next()
        } else if (!("user" in req.session) || req.session.user === null) {
            const err = new Error("Not authorized, please login")
            err.status = codes.errors.forbidden
            return next(err)
        } else {
            return next()
        }
    },
    hasher: (pass) => {
        const hasher = crypto.createHmac("sha256", process.env.SECRET)
        return hasher.update(pass).digest("hex")
    },
}