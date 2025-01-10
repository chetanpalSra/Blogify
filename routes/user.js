const {Router} = require('express');

const {handleCreateUser,handleUserSignIn,handleUserLogout} = require('../controllers/user');

const router = Router();

router.get('/signIn',(req,res)=>{
    return res.render('SignIn',{activePage: 'signin'});
})

router.get('/signUp',(req,res)=>{
    return res.render('SignUp',{activePage: 'signup'})
})

router.post('/signup',handleCreateUser);

router.post('/signin',handleUserSignIn);

router.get('/logout', handleUserLogout);

module.exports = router;