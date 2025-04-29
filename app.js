import express from 'express'
const app = express()

app.use(express.json())

import { getListing, getListings, createListing } from './database.js'


app.get("/listings", async (req, res) => {
    const listings = await getListings()
    res.send(listings)
})

app.get("/listings/:post_id", async (req,res) => {
    const post_id = req.params.post_id
    const listing = await getListing(post_id)
    res.send(listing)
} )

app.post("/listings", async(req, res)=>{
    const{title, bio,num_rooms} = req.body
    const listing = await createListing(title, bio,num_rooms)
    res.status(201).send(listing)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something Broke!')
})

app.listen(8080, () =>{
    console.log('Server is running on port 8080')
})
