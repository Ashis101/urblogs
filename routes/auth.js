const expres=require('express')
const route=expres.Router()
const authcontroller=require('../controller/auth')
const User=require('../model/auth')
const {check,body}=require('express-validator')

route.get('/signup',authcontroller.getsignup)

route.post('/signup',[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid Email')
    .custom((value)=>{
        return User.findOne({email:value}).then(user=>{
            if(user){
                return Promise.reject('Email already exist,Enter another Email')
            }
        })
    })
    .normalizeEmail(),
    body('password')
    .isAlphanumeric()
    .isLength({ min: 8 })
    .withMessage('Password have to 8 characters long'),
    body('confpass')
    .custom((value,{req})=>{
        if (value !== req.body.password) {
            throw new Error('Password have to match')
        }
        return true
    })
    
],authcontroller.postsignup)

route.get('/login',authcontroller.getlogin)

route.post('/login',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],authcontroller.postlogin)

route.post('/logout',authcontroller.postlogout)

route.get('/resetpassword',authcontroller.getreset)

route.post('/resetpassword',authcontroller.postreset)

route.get('/reset/:token',authcontroller.getresetpass)

route.post('/reset',authcontroller.postresetpass)

module.exports=route
