import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { loginUser, createUser, getListings, createListing } from './database.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const user = await createUser(name, email, password)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await loginUser(email, password)
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }
    res.status(200).json({ user_id: user[0].user_id, email: user[0].email })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})


app.get('/listings', async (req, res) => {
  try {
    const listings = await getListings()
    res.status(200).json(listings)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' })
  }
})


app.post("/listings", async(req, res)=>{
    const{listing, preferences} = req.body
    const result = await createListing(listing, preferences)
    res.status(201).send(result)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
