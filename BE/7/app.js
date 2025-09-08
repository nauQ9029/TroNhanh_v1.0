const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT
const app = express()

app.use(cors())         //Share tai nguyen giua cac cong khac nhau
app.use(express.json())
app.use('/uploads', express.static('uploads'));

//Connect DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

//Routes
//Accomodation, User,...

app.get('/', (req, res) => {
    res.send('Welcome to TRO-NHANH')
})

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const profileRoutes = require('./src/routes/profileRoutes');
app.use('/api/customer', profileRoutes);

const accommodationRoutes = require('./src/routes/accommodationRoutes')
app.use('/api/accommodation', accommodationRoutes)

const favoriteRoutes = require('./src/routes/favoritesRoutes')
app.use('/api/favorites', favoriteRoutes);

const roommateRoutes = require('./src/routes/roommateRoutes')
app.use('/api/roommates', roommateRoutes)

const reportRoutes = require('./src/routes/reportRoutes')
app.use('/api/reports',reportRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})