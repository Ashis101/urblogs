const User=require('../model/auth')
const crypto=require('crypto')
const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')
const {validationResult}=require('express-validator')
// sgMail.setApiKey('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');

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'ashisbanerjee3256@gmail.com',
        pass:'Bugcrowed123'
    }
})


exports.getsignup=(req,res)=>{
    const msg=req.flash('error')
    console.log(msg)
    res.render('auth/signup',{
        pagetitle:'signup',
        message:msg[0]
    })
}

exports.postsignup=(req,res)=>{
    const email1=req.body.email
    const password=req.body.password
    const error=validationResult(req)
    if(!error.isEmpty()){
        return  res.status(422).render('auth/signup',{
            pagetitle:'signup',
            message:error.array()[0].msg
        })
    }
    User.findOne({email:email1})
    .then(userdoc=>{
        if(userdoc){
            req.flash('error',"Email already exist")
            return res.redirect('/signup')

        }
        return bcrypt.hash(password,10).then(haspas=>{
            const user=new User({
                email:email1,
                password:haspas
            })
          user.save()
        }).then(pass=>{
            res.redirect('/login')
            return transporter.sendMail({
                to:email1,
                from:'ashisbanerjee3256@gmail.com',
                subject:'Signup successfully completed',
                html:'<h1>You succesfully signup!</h1>'
              })
            
        }).catch(err=>console.log(err))   
    }).catch(err=>{
        console.log(err)
    })
    
}

exports.getlogin=(req,res)=>{
   let message=req.flash('error')
   if(message.length > 0){
        message=message[0]
   }else{
       message=null
   }

    res.render('auth/login',{
        pagetitle:'login',
        errormessage:message
    })
}

exports.postlogin=(req,res)=>{
   const email=req.body.email
   const password=req.body.password
   User.findOne({email:email})
   .then(validuser=>{
       if(!validuser){
           req.flash('error','Username or password invalid')
           return res.redirect('/login')
       }
       return bcrypt.compare(password,validuser.password)
              .then(user=>{
                 if(user){
                    req.session.login=true
                    req.session.user=validuser
                    return req.session.save(err=>{
                        console.log(err)
                        res.redirect('/')
                    })
                 }
                 req.flash('error','Username or password invalid')
                return  res.redirect('/login')

              })
              .catch(err=>{
                    console.log(err)
                    res.redirect('/login')
              })
   })
   .catch(err=>{
    console.log(err)
    res.redirect('/login')
   })
    
}

exports.postlogout=(req,res)=>{
    req.session.destroy(err=>{
        console.log(err)
        res.redirect('/')
    })
}

exports.getreset=(req,res)=>{
    const message=req.flash('error')
    res.render('auth/reset',{
        pagetitle:'resetpassword',
        msg:message
    })

}

exports.postreset=(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token=buffer.toString('hex')
        const email=req.body.email
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/resetpassword');
                }
            user.resettoken = token;
            user.resettokenexpire = Date.now() + 3600000;
            return user.save();
            })
        .then(()=>{
            res.redirect('/blogs')
            return transporter.sendMail({
                to:req.body.email,
                from:'ashisbanerjee3256@gmail.com',
                subject:'reseting your password',
                html:`you requested to change your password
                    clicked the link below
                    <a href='http://localhost:8000/reset/${token}'>Resetpassword</a>
                `

            })
        })
        .catch(err=>{
            console.log(err)
        })
    })
   
}

exports.getresetpass=(req,res)=>{
    const token=req.params.token
    User.findOne({resettoken:token,resettokenexpire:{$gt:Date.now()}})
    .then(resetpass=>{
        console.log(resetpass)
        res.render('auth/resetpassword',{
            pagetitle:'ResetPassword',
            token:token,
            userid:resetpass._id

        })
    })
    .catch(err=>{
        console.log(err)
    })


}

exports.postresetpass=(req,res)=>{
    const token=req.body.token
    const id=req.body.userid
    const newpassword=req.body.newpass
    let user
    User.findOne({_id:id,resettoken:token})
    .then(users=>{
        user=users
        return bcrypt.hash(newpassword,10)
    })
    .then(haspass=>{
        user.password=haspass
        user.resettoken=undefined
        user.resettokenexpire=undefined
        return user.save()
    })
    .then(()=>{
        res.redirect('/login')

    })
    .catch(err=>{
        console.log(err)
    })
}