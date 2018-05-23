const express = require('express');
const app = express();
require('./models/Url');
const routes = require('./routes/routes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path'); 
const mongoose = require('mongoose');

// Connect to database
mongoose.connect(process.env.DATABASE_URI);

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'pug'); 
app.use(express.static(__dirname + '/public'));
console.log(__dirname + '/public');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('combined'));
app.get("/", routes);
app.post("/submit", routes);
app.get("/:sid", routes);


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
