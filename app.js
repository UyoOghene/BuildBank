const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const projectRoutes = require('./routes/projects');
const app = express();
const engine = require('ejs-mate');

app.engine('ejs', engine);
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost:27017/construction-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.ejs');
  });
  
app.use('/projects', projectRoutes);

app.listen(3000, () =>  console.log('App running on http://localhost:3000'));

