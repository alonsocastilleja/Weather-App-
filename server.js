// The following 3 modules will be used in the application.
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv')

// Assigning the Express object to a constant variable named 'app'.
const app = express();


dotenv.config();
const apiKey = process.env.KEY;

// Used to access the CSS files located in the 'public' folder.
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));     // Accesses the request body info
app.set('view engine', 'ejs');          // Sets up the template engine to 'ejs'

// Uses the GET method for rendering the index.ejs file as a response.
app.get('/', function(req, res) {
    res.render('index', { weather: null, error: null });
});

// Uses the POST method to request the server for the weather.
app.post('/', function(req, res) {
    // Stores the city from the request body in the city variable.
    let city = req.body.city;   
    
    // A request is made with the city name and API key as parameters in the url.
    // Error handling: if there is an error, send an error message to index.ejs
    // Otherwise, send the weather information to index.ejs
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    request(url, function(err, response, body) {
        console.log(body)
        if(err){
            response.render('index', { weather: null, error: 'Please try again. An error has been encountered.'});
        } else {
            let weather = JSON.parse(body)
            if(weather.main == undefined) {
                res.render('index', { weather: null, error: 'Please try again. An error has been encountered.'});
            } else {
                let weatherText = `It is ${weather.main.temp} degrees with ${weather.weather[0].main} in ${weather.name}!`;
                res.render('index', { weather: weatherText, error: null });
            }
        }
    })

})

// The application is listening at port 3000 or the one set by the environment variable.
app.listen(3000, function() {
    console.log('Weather app is listening on port 3000')
});