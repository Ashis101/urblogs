const express=require('express')
const app=express()
const port=8000
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const session=require('express-session')
const Mongodbstore=require('connect-mongodb-session')(session)
const csrf=require('csurf')
const flash=require('connect-flash')
const path=require('path')
const multer=require('multer')
const mongoUri='mongodb+srv://noder:nodejs@cluster0-1wmiy.mongodb.net/practise?retryWrites=true&w=majority'

const storage=multer.diskStorage({
  destination:'images',
  filename:((req,file,cb)=>{
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
  })
  
})
  
function filter(req,file,cb){
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null,true)
    } else {
      cb(null,false)
    }
}

const route=require('./routes/home')
const authroute=require('./routes/auth')
const userblog=require('./routes/usersblog')

const User=require('./model/auth')
app.use(bodyparser.urlencoded({extended:false}))
app.use(multer({storage:storage,fileFilter:filter,}).single('image'))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(express.static(path.join(__dirname,'useimage')))
app.set('view engine','ejs')
app.set('views','view')

const csrfprotection=csrf()


mongoose.connect(mongoUri).then(()=>{
    console.log('Database connected')
})

const sessionstore=new Mongodbstore({
    uri:mongoUri,
    collection:'sessions'
})

app.use(session({secret:'mysecret',
    resave:false,
    saveUninitialized:false,
    store:sessionstore
    }))
// app.use(csrfprotection)
app.use(flash())
app.use((req,res,next)=>{
    res.locals.isauth=req.session.login
    // res.locals.csrfpro=req.csrfToken()
    next()
})

 app.use((req,res,next)=>{
    if (!req.session.user) {
              return next();
             }
    User.findById(req.session.user._id)
    .then(user=>{
        req.user=user
        next()
    })
    .catch(err=>{   
        console.log(err)

    })
})


app.use(route)
app.use(authroute)
app.use(userblog)





app.listen(port,()=>{
    console.log(`server running on ${port}`)
})