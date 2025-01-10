const mongoose = require('mongoose');
const {createTokenForUser} = require('../services/auth');

const {createHmac,randomBytes} = require('crypto'); // builtin package

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt:{
     type: String,
    },
    password:{
        type: String,
        required: true, 
    },
    profileImageUrl:{
        type: 'String',
        default: '/Images/default.png'

    },
    role:{
        type: String,
        enum: ['USER','ADMIN'],
        //Means we cannot give anything except this two and role is always enum.
        default:'USER',
    }

},{timestamps: true});

//static method allows to query all the collection,findOne() is a static method,it is related to full model rather than it's instance.
userSchema.static('matchPasswordAndGenerateToken',async function (email,password){
       const user = await this.findOne({email});
       if(!user) throw new Error("User not found!");
       
       const salt = user.salt;
       const hashedPassword = user.password;

       const userProvidedHash = createHmac('sha256',salt).update(password).digest('hex');

       if(hashedPassword !== userProvidedHash){
          throw new Error('Incorrect Password');
       } 

       const token = createTokenForUser(user);

       return token; //returns user without password and salt.

})

// In Mongoose, a pre('save') hook is a middleware function that gets executed before a document is saved to the database. It allows you to run custom logic (e.g., hashing a password, validating data, modifying fields) before the save() method is called.
  
//Use a regular function when you need this to refer to the current context, like a Mongoose document.
// Use an arrow function when you want this to inherit the surrounding context,here function (next) is regular function which will refer to current document that will get saved see the images folder here for reason.

userSchema.pre('save',function (next){
    //"this" points to current document.
     const user = this;

     if(!user.isModified('password')) return next();
    //  This is a Mongoose method that checks if a specific field (in this case, password) has been modified since the document was last retrieved from the database.
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest('hex');
    
    user.salt = salt;
    user.password = hashedPassword;
    next(); 
    
})

const User = mongoose.model('user',userSchema);

module.exports = User;

//createHmac('sha256', salt):

// Creates an HMAC object using the SHA-256 hashing algorithm and a secret salt.
// The salt is a random string that adds additional security to the hash to prevent rainbow table attacks.
// .update(user.password):
// Takes the user's password and feeds it into the HMAC object to create a hash.
// .digest('hex'):

// Converts the final hash to a hexadecimal string.
 