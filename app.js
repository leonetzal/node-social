const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');

const { postRouter } = require('./routes/post');
const { authRouter } = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB Connected...');
    });

mongoose.connection.on('error', err => {
    console.log(`DB Connection Error: ${err.message}`);
});

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use("/post", postRouter);
app.use("/signup", authRouter);

app.listen(port, () => {
    console.log(`A NodeJS API is listening the port: ${port}`);
});