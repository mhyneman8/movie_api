const jwtSecret = 'your_jwt_secret';        // Key used in JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,             // Username encoding to JWT
        expiresIn: '7d',                    // days til expiration
        algorithm: 'HS256'                  // Algorithm to encode values in JWT
    });
}

/**
 * POST login
 * @param {*} router 
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        }) (req, res);
    });
}