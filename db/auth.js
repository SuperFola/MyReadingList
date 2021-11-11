require("dotenv").config()

const codes = require("../httpcodes")
const crypto = require("crypto")

module.exports = {
    isAuthorized: (req, _, next) => {
        if (!("user" in req.session) || req.session.user === null) {
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