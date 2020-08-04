const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator');

const express = require('express');
const app = express();

const { postRouter } = require('./routes/post');
const { authRouter } = require('./routes/auth');
const { userRouter } = require('./routes/user');

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

app.use(cookieParser())
app.use(expressValidator());
app.use(bodyParser.json());

app.use("/", postRouter);
app.use("/", authRouter);
app.use("/", userRouter);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({
        error: "Unauthorized!"
      });
    }
  });

app.listen(port, () => {
    console.log(`A NodeJS API is listening the port: ${port}`);
});