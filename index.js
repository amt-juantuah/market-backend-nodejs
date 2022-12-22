const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/UserRoute')
const authRoutes = require('./routes/AuthRoute')
const cartRoutes = require('./routes/CartRoute')
const productRoutes = require('./routes/ProductRoute')
const orderRoutes = require('./routes/OrderRoute')
const categoryRoutes = require('./routes/CategoryRoute')

//configure dotenv to use and retrieve needs
dotenv.config();
const uriString = process.env.MONGO_URL1 + process.env.MONGO_PASS + process.env.MONGO_URL2;
const listenPort = process.env.PORT;

// set mongoose strictquering to true
mongoose.set('strictQuery', true);

// reconstruct indexes of all collections to match
// schemas
// mongoose.connection.syncIndexes();

// connect to db
mongoose.connect(uriString, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: true
        })
        .then(() => console.log("Connection to MongoDB Established"))
        .catch((err) => console.log(err));

        
// should be json friendly
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/category', categoryRoutes);

// listen for changes on port
app.listen( process.env.PORT || 5000, ()=>{
    console.log("Megatron Backend is Running Live");
})