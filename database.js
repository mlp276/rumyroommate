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
    const [rows] = await pool.query("SELECT * FROM Listings")
    return rows;
}

export async function getListing(post_id){
    const [rows] = await pool.query('SELECT * FROM Listings WHERE post_id = ?', [post_id])
    return rows
}

export async function createListing(title, bio, num_rooms){
    const [result] = await pool.query('INSERT INTO Listings (title, bio, num_rooms) VALUES (?, ?, ?)', [title, bio, num_rooms])
    const post_id = result.insertId
    return getListing(post_id)
}
