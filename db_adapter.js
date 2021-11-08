class Database {
    constructor() {
        // TODO change me to use an on-disk database instead of an in-memory one
        this.db = require("./fake_db")
        this.auto_increment = Object.values(this.db).map(v => v.length).reduce((a, b) => a + b)
    }

    select(table, req) {
        let data = this.db.hasOwnProperty(table) ? this.db[table] : []
        return data.filter(req)
    }

    count(table, req) {
        return this.select(table, req).length
    }

    insert(table, ...data) {
        if (this.db.hasOwnProperty(table)) {
            data.forEach(val => {
                this.db[table].push({
                    id: this.auto_increment,
                    ...val
                })
                this.auto_increment += 1
            })
            console.log(this.db)
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
