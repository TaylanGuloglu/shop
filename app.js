const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
//const bcrypt = require('bcrypt')

const pageRoute = require('./routes/pageRoute');
const productRoute = require('./routes/productRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

//Db Connection
mongoose
  .connect('mongodb://localhost/basicshop-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
  })
  .then(() => {
    console.log('SUCCESSFUL DB CONNCECTION');
  });

//Template Engine
app.set('view engine', 'ejs');

//Global Variable
global.userIn = null;

//Middlewares
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/basicshop-db' }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//Routes
app.use('*', (req, res, next) => {
  userIn = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/products', productRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 4000;
app.listen(port, () => {
  console.log(`Server listen port ${port}...`);
});
