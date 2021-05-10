const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uuid = require('uuid');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

let movie = [
    {
        title: 'Cool Runnings',
        director: 'Jon Turteltaub',
        cast: ['John Candy', 'Leon', 'Doug E. Doug'],
        genre: ['Adventure', 'Comedy', 'Family'],
        description: 'When a Jamaican sprinter is disqualified from the Olympic Games, he enlists the help of a dishonored coach to start the first Jamaican Bobsled Team.',
        image: 'https://m.media-amazon.com/images/M/MV5BMjMxMTQ3MzMwMV5BMl5BanBnXkFtZTgwNTYxNzYxMTE@._V1_UX182_CR0,0,182,268_AL_.jpg'

    },
    {
        title: 'Boyhood',
        director: 'RichardLinklater',
        cast: ['Ellar Coltrane', 'Patricia Arquette', 'Ethan Hawke'],
        genre: 'Drama',
        description: 'The life of Mason, from early childhood to his arrival at college.',
        image: 'https://m.media-amazon.com/images/M/MV5BMTYzNDc2MDc0N15BMl5BanBnXkFtZTgwOTcwMDQ5MTE@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'Seven',
        director: 'David Fincher',
        cast: ['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey'],
        genre: ['Crime', 'Drama', 'Mystery'],
        description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
        image: 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'Casablanca',
        director: 'Michael Curtiz',
        cast: ['Humphrey Bogart', 'Ingrid Bergman', 'Paul Henreid'],
        genre: ['Drama', 'Romance', 'War'],
        description: 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
        image: 'https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'Across the Universe',
        director: 'Julie Taymor',
        cast: ['Evan Rachel Wood', 'Jim Sturgess', 'Joe Anderson'],
        genre: ['Drama', 'Fantasy', 'History'],
        description: 'The music of The Beatles and the Vietnam War form the backdrop for the romance between an upper-class American girl and a poor Liverpudlian artist.',
        image: 'https://m.media-amazon.com/images/M/MV5BMTIyMTUwNzg3Nl5BMl5BanBnXkFtZTcwMjM1MDI1MQ@@._V1_UX182_CR0,0,182,268_AL_.jpg'

    },
    {
        title: 'The Good, The Bad and the Ugly',
        director: 'Sergio Leone',
        cast: ['Clint Eastwood', 'Eli Wallach', 'Lee Van Cleef'],
        genre: 'Western',
        description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
        image: 'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
        genre: 'Drama',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        image: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'Arsenic and Old Lace',
        director: 'Frank Capra',
        cast: ['Cary Grant', 'Priscilla Lane', 'Raymond Massey'],
        genre: ['Comedy', 'Crime', 'Thriller'],
        description: 'A writer of books on the futility of marriage risks his reputation when he decides to get married. Things get even more complicated when he learns on his wedding day that his beloved maiden aunts are habitual murderers.',
        image: 'https://m.media-amazon.com/images/M/MV5BZDVlNTBjMjctNjAzNS00ZGJhLTg2NzMtNzIwYTIzYTBiMDkyXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'Almost Famous',
        director: 'Cameron Crowe',
        cast: ['Billy Crudup', 'Patrick Fugit', 'Kate Hudson'],
        genre: ['Adventure', 'Comedy', 'Drama'],
        description: 'A high-school boy is given the chance to write a story for Rolling Stone Magazine about an up-and-coming rock band as he accompanies them on their concert tour.',
        image: 'https://m.media-amazon.com/images/M/MV5BMzY1ZjMwMGEtYTY1ZS00ZDllLTk0ZmUtYzA3ZTA4NmYwNGNkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_UX182_CR0,0,182,268_AL_.jpg'
    },
    {
        title: 'That Thing You Do',
        director: 'Tom Hanks',
        cast: ['Tom Hanks', 'Liv Tyler', 'Carleze Theron'],
        genre: ['Comedy', 'Drama', 'Music'],
        description: 'A local Pennsylvania band scores a one-hit wonder in 1964 and rides the star-making machinery as long as they can, with lots of help from their manager.',
        image: 'https://m.media-amazon.com/images/M/MV5BOWVmN2ZhZjgtZGEzMy00NDkxLWI5YWQtYTE2ZTk0YzIyMzc0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg'
    }
];

app.use(morgan('common'));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET requests
app.get('/', (req, res) => {
    res.send('Here are my top movies!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

// Gets the list of data about all movies
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Return data about single movie
app.get('/movies/:title', (req, res) => {
    Movies.findOne({ 'Title': req.params.title})
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre by title
app.get('/movies/genre/:Name', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name})
    .then((movies) => {
        res.json(movies.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Returns data about a director by name
app.get('/movies/director/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movies) => {
        res.json(movies.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Allows new users to register
/* We'll expect JSON in this information{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
*/
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              BirthDate: req.body.BirthDate
            })
            .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Gets all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Allows user to update their user info
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            BirthDate: req.body.BirthDate
        }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Allows users to add movie to their list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
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

// Removes movie from favorite list
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
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

// Allow users to deregister
app.delete('/users/:Username', (req, res) => {
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


app.listen(8080, () => {
console.log('My first Node test server is running on Port 8080.');
});
