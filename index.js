const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
// app.use(cors()); Allows from all origins

// CORS handling

// change back to use(cors({
app.use(cors());
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             let message = "The CORS policy for this application doesn't allow acces from origin " + origin;
//             return callback(new Error(message), false);
//         }
//         return callback(null, true);
//     }
// }));

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

// Integrated Mongoos with REST API
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// local database
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});
// online database
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Imports auth.js for logins
let auth = require('./auth')(app);

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://myflix-mh.netlify.app'];

// User morgan logging common
app.use(morgan('common'));

// Set static file directory to public
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix! Where you can keep track of all your favorite movies.');
    res.sendFile('public/documentation.html');
});

/**
 * Returns documentation for API
 */

app.get('/documentation',
//  passport.authenticate('jwt', { session: false }), 
 (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});


/**
 * Returns all movies from the database to the user
 * Protected route
 * @method GET
 * @param {string} endpoint - "url/movies"
 * @returns {object} movie
 */

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Returns data about a single movie by title
 * Protected route
 * @method GET
 * @param {string} endpoint 
 * @param {string} Title
 * @returns {object} 
 */

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Title': req.params.title })
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Returns data about a genre
 * @method GET
 * @param {string} endpoint - "url/movies/genre"
 * @param {string} Name of genre
 * @returns {object} 
 */ 

app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((movies) => {
            res.json(movies.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Loads data about director
 * @method GET
 * @param {string} endpoint -"url/movies/director"
 * @param {string} Name of director
 * @returns {object}
 */

app.get('/movies/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movies) => {
            res.json(movies.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * Allows users to register
 * @method POST
 * @param {string} endpoint - "url/users"
 * @param {string} Name
 * @param {string} Email
 * @param {string} Password
 * @param {date} birthday
 * @returns {object} user
 */

/** We'll expect JSON in this information
* {
*  ID: Integer,
*  Username: String,
*  Password: String,
*  Email: String,
*  Birthday: Date
* }
*/

app.post('/users',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            BirthDate: req.body.BirthDate
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).send('Error: ' + err);
                        })
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

/**
 * Get all users
 * @method GET
 * @param {string} endpoint - "url/users"
 * @return {object} users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Get a user by username
 * @method GET
 * @param {string} endpoint - "url/users"
 * @param {string} username
 * @returns {object} user
 *  */ 
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Allows user to update their user info
 * @method PUT
 * @param {string} endpoint - "url/users"
 * @param {string} username
 * 
 */

app.put('/users/:Username',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], passport.authenticate('jwt', { session: false }), (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOneAndUpdate({ Username: req.params.Username },
            {
                $set:
                {
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    BirthDate: req.body.BirthDate
                }
            },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });

/**
 * Allows users to add movie to their list of favorites
 * @method POST
 * @param {string} endpoint= "url/users/:username/movies/:movieID"
 * @param {string} username
 * @param {number} movieID 
 */

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, //This line makes sure that the updated doc is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/**
 * Removes movie from favorite list
 * @method POST
 * @param {string} endpoint - "url/user/:Username/Movies/remove/"
 * @param {string} username
 * @param {number} movieID
 */

app.post('/users/:Username/Movies/remove/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/**
 * Allow users to deregister
 * @method DELETE 
 * @param {string} endpoint - "url/users"
 * @param {string} username
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
