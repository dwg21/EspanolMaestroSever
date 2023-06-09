require('dotenv').config();
require('express-async-errors'); // Dont need to use try catch in routes


//express
const express = require('express');
const app = express()

// rest of packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// const cors = require('cors');


const path = require('path');

//database
const connectDB = require('./db/connect');

//router
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const userDataRouter = require('./routes/UserDataRoutes');
const translationRouter = require('./routes/translationRoutes');

//middleware 
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(express.static(path.resolve(__dirname, './build')))

app.use(morgan('tiny'));
app.use(express.json()); //logs each request to the console
app.use(cookieParser(process.env.JWT_SECRET));



// app.use(cors({
//     origin:'https://http://localhost:3000/',
//     credentials: true,
// }))





//route initilsiation
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/userdata', userDataRouter);
app.use('/api/v1/translate', translationRouter);



app.get('/', (req, res) => {
    res.send('e-commerce api')
});

app.get('/api/v1/', (req, res) => {
    console.log(req.signedCookies)
    res.send('e-commerce api')
});


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3005

const start = async () => {
    try {
        connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is Listeing on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}




start()