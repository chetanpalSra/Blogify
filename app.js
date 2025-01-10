require('dotenv').config(); // It is placed generally at top.

const express = require('express');

const path = require('path');

const cookieParser = require('cookie-parser')

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const {connectToMongoDb} = require('./connection.js');

const {checkForAuthenticationCookie} = require('./middlewares/auth');

const {handleGetBlog} = require('./controllers/blog');

const app = express();




const PORT = process.env.PORT || 7003;

const url = process.env.MONGO_URL;

connectToMongoDb(url);

//when we deploy so devDependency are not included so project size become small,also nodemon is not needed when we deploy so it is installed as devDependency.

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public'))); //means now express can will statically serve anything that is in public directly.actually if we not use this middleware so we will get no image in card.
//As express cannot serve static assets such as image-filename as express consider image filename as url on which we are requesting ,but it not exists as it is image-filename not any url.
// The line -->
// app.use(express.static(path.resolve('./public')));
// means that your Express.js application will serve static files (like images, CSS, JavaScript files, etc.) from the public directory.

app.use(express.static(path.resolve('./views')));

app.get('/',handleGetBlog);

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,()=>{
    console.log(`The Server Started at PORT:${PORT}`);
    
})

// In Node.js, the export command is used in Linux/Mac terminals to set environment variables temporarily for your current shell session.

// And also change index to app.js in package.json and index filename so as aws except it. 