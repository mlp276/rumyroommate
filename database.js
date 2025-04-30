import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getListings(){
    const [rows] = await pool.query("SELECT * , p.female, p.male, p.other, p.smoker, p.non_smoker, p.clean FROM Listings l LEFT JOIN Preferences p ON l.post_id = p.post_id")
    return rows;
}

export async function getListing(post_id){
    const [rows] = await pool.query(`SELECT l.*, p.female, p.male, p.other, p.smoker, p.non_smoker, p.clean FROM Listings l LEFT JOIN Preferences p ON l.post_id = p.post_id WHERE l.post_id = ?`, [post_id])
    return rows
}

export async function createListing(listing, preferences) {
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        const {
            title, campus, house_address, house_type,
            num_rooms, num_bath, roommates, rent,
            dt_available, bio
        } = listing

        const [listingResult] = await conn.query(
            `INSERT INTO Listings 
            (title, campus, house_address, house_type, num_rooms, num_bath, roommates, rent, dt_available, bio) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, campus, house_address, house_type, num_rooms, num_bath, roommates, rent, dt_available, bio]
        )

        const post_id = listingResult.insertId

        const {
            female = false,
            male = false,
            other = false,
            smoker = false,
            non_smoker = false,
            clean = null
        } = preferences

        await conn.query(
            `INSERT INTO Preferences 
            (post_id, female, male, other, smoker, non_smoker, clean) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [post_id, female, male, other, smoker, non_smoker, clean]
        )

        await conn.commit()

        const [result] = await conn.query(
            `SELECT * FROM Listings WHERE post_id = ?`, [post_id]
        )
        return result
    } catch (err) {
        await conn.rollback()
        throw err
    } finally {
        conn.release()
    }
}
