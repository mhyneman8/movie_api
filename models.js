const mongoose = require('mongoose');

/**
 * Defines the schema for the movies collection that was created in MongoDB.
 * Genre, Director, and Actors are subdocuments which contain additional keys holding informaiton.
 * To add a new movie, a Title and description is required and must be a string.
 */

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

const bcrypt = require('bcrypt');

/**
 * Defines the schema for the users collection that was created in MongoDB.
 * To add a new user, the username, password, and email is required and must be a string.
 * Favorite Movies contains an array of IDs which refer to the document within the dm.movies collection
 */

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    BirthDate: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

// creates models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// export models
module.exports.Movie = Movie;
module.exports.User = User;
