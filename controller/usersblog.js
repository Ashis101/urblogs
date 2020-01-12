const Userblog=require('../model/userblog')
const {validationResult}=require('express-validator')
exports.getaddblog=(req,res)=>{
    let error=req.flash('error')
    res.render('user/addblogs',{
        pagetitle:'addblogs',
        errormsg:error[0]
    })

}
exports.getmyblog=(req,res)=>{
    Userblog.find({userid:req.user.id})
    .then(blogs=>{
        res.render('user/usersblogs',{
            pagetitle:'myblogs',
            blog:blogs
        })
    })
    .catch(err=>{
        console.log(err)
    })


   
}
exports.postaddblog=(req,res)=>{
    const image=req.file
    const title=req.body.title
    const summery=req.body.summery
    const details=req.body.details
    if(!image){
        req.flash('error','This file is not accepted')
        return  res.redirect('/addblogs')
    }
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).render('user/addblogs', {
        pagetitle: 'Add Blogs',
        errormsg: errors.array()[0].msg,
    });
  }
    const imageUrl=image.path   
    const blog=new Userblog({
        imageUrl:imageUrl,
        title:title,
        summery:summery,
        description:details,
        userid:req.user
    })
    blog.save()
    .then(result=>{
        console.log('Product Created')
        res.redirect('/blogs')
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.getedit=(req,res)=>{
    const editblog=req.params.id
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('user/addblogs', {
        pagetitle: 'Add Blogs',
        errormsg: errors.array()[0].msg,
      });
    }
    Userblog.findById(editblog) 
    .then(blog=>{
        res.render('user/edit',{
            pagetitle:'Edit Blog',
            data:blog
        })
    })
    .catch(err=>{ 
        console.log(err)
    })

}
 
exports.postedit=(req,res)=>{
        const updateimageUrl=req.file
        const updatetitle=req.body.title
        const updatesummery=req.body.summery
        const updatedescription=req.body.details
        const blogid=req.params.id
       Userblog.findById(blogid)
       .then(ublog=>{
        console.log(ublog)
           if(ublog.userid.toString() != req.user._id.toString()){
               return res.redirect('/')
           }
           ublog.imageUrl=updateimageUrl.path
           ublog.title=updatetitle,
           ublog.summery=updatesummery,
           ublog.description=updatedescription
           return ublog.save().then(x=>{
            res.redirect('/myblogs')
        })
       })
       
       .catch(err=>{
           console.log(err)
       })
}



exports.postdetete=(req,res)=>{
    const delblog=req.params.del
    Userblog.deleteOne({_id:delblog,userid:req.user._id})
    .then(result=>{
        res.redirect('/blogs')
    })
    .catch(err=>{
        console.log(err)
    })

}