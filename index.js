const express = require('express');
const  morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'Cool Runnings',
        director: 'Jon Turteltaub',
        cast: ['John Candy', 'Leon', 'Doug E. Doug']
    },
    {
        title: 'Boyhood',
        director: 'RichardLinklater',
        cast: ['Ellar Coltrane', 'Patricia Arquette', 'Ethan Hawke']
    },
    {
        title: 'Seven',
        director: 'David Fincher',
        cast: ['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey']
    },
    {
        title: 'Casablanca',
        director: 'Michael Curtiz',
        cast: ['Humphrey Bogart', 'Ingrid Bergman', 'Paul Henreid']
    },
    {
        title: 'Across the Universe',
        director: 'Julie Taymor',
        cast: ['Evan Rachel Wood', 'Jim Sturgess', 'Joe Anderson']
    },
    {
        title: 'The Good, The Bad and the Ugly',
        director: 'Sergio Leone',
        cast: ['Clint Eastwood', 'Eli Wallach', 'Lee Van Cleef']
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
    },
    {
        title: 'Arsenic and Old Lace',
        director: 'Frank Capra',
        cast: ['Cary Grant', 'Priscilla Lane', 'Raymond Massey']
    },
    {
        title: 'Almost Famous',
        director: 'Cameron Crowe',
        cast: ['Billy Crudup', 'Patrick Fugit', 'Kate Hudson']
    },
    {
        title: 'That Thing You Do',
        director: 'Tom Hanks',
        cast: ['Tom Hanks', 'Liv Tyler', 'Carleze Theron']
    }
];

app.use(morgan('common'));
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
    res.send('Here are my top movies!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
console.log('My first Node test server is running on Port 8080.');
});
