const User = require('../models/user');

async function handleCreateUser(req, res) {

    const { fullName, email, password } = req.body;

    await User.create({ fullName, email, password });

    return res.redirect('/');


}
async function handleUserSignIn(req, res) {

    try {
        const { email, password } = req.body;

        const token = await User.matchPasswordAndGenerateToken(email, password);

        //TODO: setExpiry date for cookie.
        return res.cookie('token', token, {
            expires: new Date(Date.now() + 86400000),
            // secure: true // Use this if you're working on HTTPS, optional for HTTP
        }).redirect('/');
    } catch (error) {
        return res.render('signIn', {
            error: 'Incorrect Email or Password',
            activePage: 'signin',
        });
    }


}

function handleUserLogout(req,res){
    return res.clearCookie('token').redirect('/user/signIn');
}

module.exports = { handleCreateUser, handleUserSignIn ,handleUserLogout};