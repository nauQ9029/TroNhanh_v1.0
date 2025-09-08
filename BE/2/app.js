const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT
const app = express()

app.use(cors())         //Share tai nguyen giua cac cong khac nhau
app.use(express.json())

//Connect DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

//Routes
//Accomodation, User,...

app.get('/', (req, res) => {
    res.send('Welcome to TRO-NHANH')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})