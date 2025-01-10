const { validateToken } = require('../services/auth')

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {

        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }
        try {
            // as if req.cookies[cookieName] is undefined or null so it can throw runtime error so error-handling used here,we can also use chaining operator ,i.e, ?. , as we used earlier instead of error-handling.

            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next();
        } catch (error) {
            //Proceed further without throwing error.
           return next();
        }
    }
}

module.exports = {checkForAuthenticationCookie};