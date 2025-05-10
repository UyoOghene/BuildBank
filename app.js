if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const projectRoutes = require('./routes/projects');
const app = express();
const engine = require('ejs-mate');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const LocalStrategy = require('passport-local');
const User = require('./models/user');

// app.engine('ejs', engine);
// app.set('view engine', 'ejs');


// mongoose.connect('mongodb://localhost:27017/construction-tracker', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.render('index.ejs');
//   });
  
// app.use('/projects', projectRoutes);

// app.listen(3000, () =>  console.log('App running on http://localhost:3000'));






const MongoDBStore = require('connect-mongo');
// const mongoURI = "mongodb+srv://uyooghene01:8DpkF4c6ZQwLLnLN@cluster0.cjvxacf.mongodb.net/vercellessontwo"
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/construction-tracker';



mongoose.connect(mongoURI, {

  useNewUrlParser: true,
  useUnifiedTopology: true, 
  serverSelectionTimeoutMS: 10000 
})
.then(() => console.log("Database connected successfully"))
.catch(err => console.log("Database connection error:", err));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
// for vercel

const store = MongoDBStore.create({
  mongoUrl: mongoURI,
  crypto: {
    secret: secret
  },
  touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
  store: store,
  name: 'session',
  secret: secret,
  resave: false,
  saveUninitialized: false, 
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
    domain: process.env.NODE_ENV === 'production' 
      ? '.build-bank-xi.vercel.app' 
      : undefined,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};



// // for Development(localhost)
// const sessionConfig = {
//   secret: 'thisshouldbeabettersecret!',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7
// }

// };

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

const authRoutes = require('./routes/auth');
app.use(authRoutes);

app.get('/', (req, res) => {
    res.render('index.ejs');
  });
  
app.use('/projects', projectRoutes);

app.listen(3000, () =>  console.log('App running on http://localhost:3000'));



