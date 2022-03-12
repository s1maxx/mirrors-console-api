import dotenv from 'dotenv'
dotenv.config()

import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

export default {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
}