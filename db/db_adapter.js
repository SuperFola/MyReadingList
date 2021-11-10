class Database {
    constructor() {
        // TODO change me to use an on-disk database instead of an in-memory one
        this.db = require("./fake_db")
        this.auto_increment = Object.values(this.db).map(v => v.length).reduce((a, b) => a + b)
    }

    async select(table, req) {
        let data = Object.prototype.hasOwnProperty.call(this.db, table) ? this.db[table] : []
        return data.filter(req)
    }

    async count(table, req) {
        return (await this.select(table, req)).length
    }

    async insert(table, ...data) {
        if (Object.prototype.hasOwnProperty.call(this.db, table)) {
            return data.map(val => {
                this.db[table].push({
                    id: this.auto_increment,
                    ...val
                })
                this.auto_increment += 1
                return this.auto_increment - 1
            })
        } else {
            this.db[table] = data
            return []
        }
    }

    async update(table, filter, req) {
        if (Object.prototype.hasOwnProperty.call(this.db, table)) {
            this.db[table].filter((value, idx) => {
                if (filter(value)) {
                    this.db[table][idx] = req(value)
                }
            })
        } else {
            throw new Error(`<db> Unknown table ${table} when trying to update db (columns: ${Object.keys(this.db).join(', ')})`)
        }
    }

    async delete(table, req) {
        if (Object.prototype.hasOwnProperty.call(this.db, table)) {
            this.db[table] = this.db[table].filter((value) => !req(value))
        } else {
            throw new Error(`<db> Unknown table ${table} when trying to delete rows (columns: ${Object.keys(this.db).join(', ')})`)
        }
    }
}

module.exports = new Database()