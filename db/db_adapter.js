const fs = require("fs")

class Database {
    constructor(file, with_autoinc = true) {
        this.path = `${__dirname}/schema/${file}.json`
        this.with_autoinc = with_autoinc
        if (!fs.existsSync(this.path) && file === "users") {
            fs.writeFileSync(this.path, '{"users": []}')
        }
        this.db = require(this.path)
        this.auto_increment = Object.values(this.db).map(v => v.length).reduce((a, b) => a + b)
    }

    saveToDisk() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.db))
        } catch (e) {
            console.error(e)
        }
    }

    async select(table, req) {
        let data = Object.prototype.hasOwnProperty.call(this.db, table) ? this.db[table] : []
        return data.filter(req)
    }

    async count(table, req) {
        return (await this.select(table, req)).length
    }

    async insert(table, data, saveToDisk = true) {
        if (Object.prototype.hasOwnProperty.call(this.db, table)) {
            const id = this.auto_increment

            this.db[table].push(this.with_autoinc ? {
                id: this.auto_increment,
                ...data
            } : data)
            this.auto_increment += 1

            if (saveToDisk) {
                this.saveToDisk()
            }

            return this.with_autoinc ? id : true
        } else {
            this.db[table] = [data]
            return null
        }
    }

    async update(table, filter, req, saveToDisk = true) {
        if (Object.prototype.hasOwnProperty.call(this.db, table)) {
            for (let idx = 0; idx < this.db[table].length; ++idx) {
                const value = this.db[table][idx]
                if (await filter(value)) {
                    this.db[table][idx] = await req(value)
                }
            }

            if (saveToDisk) {
                this.saveToDisk()
            }
        } else {
            throw new Error(`<db> Unknown table ${table} when trying to update db (columns: ${Object.keys(this.db).join(', ')})`)
        }
    }

    async delete(table, req, saveToDisk = true) {
        if (Object.prototype.hasOwnProperty.call(this.db, table)) {
            this.db[table] = this.db[table].filter((value) => !req(value))

            if (saveToDisk) {
                this.saveToDisk()
            }
        } else {
            throw new Error(`<db> Unknown table ${table} when trying to delete rows (columns: ${Object.keys(this.db).join(', ')})`)
        }
    }
}

module.exports = (file) => new Database(file)
