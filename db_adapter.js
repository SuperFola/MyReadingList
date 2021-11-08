class Database {
    constructor() {
        // TODO change me to use an on-disk database instead of an in-memory one
        this.db = require("./fake_db")
    }

    select(table, req) {
        let data = this.db.hasOwnProperty(table) ? this.db[table] : []
        return data.filter(req)
    }

    insert(table, ...data) {
        if (this.db.hasOwnProperty(table)) {
            Array.prototype.unshift.apply(this.db, data)
        } else {
            this.db[table] = data
        }
    }

    update(table, filter, req) {
        if (this.db.hasOwnProperty(table)) {
            this.db[table].filter((value, idx) => {
                if (filter(value)) {
                    this.db[table][idx] = req(value)
                }
            })
        } else {
            throw new Error(`<db> Unknown table ${table} when trying to update db (columns: ${Object.keys(this.db).join(', ')})`)
        }
    }

    delete(table, req) {
        if (this.db.hasOwnProperty(table)) {
            this.db[table] = this.db[table].filter((value) => !req(value))
        } else {
            throw new Error(`<db> Unknown table ${table} when trying to delete rows (columns: ${Object.keys(this.db).join(', ')})`)
        }
    }
}

module.exports = new Database()
