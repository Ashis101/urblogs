const Userblog=require('../model/userblog')


exports.home=(req,res)=>{
    res.render('home',{
        pagetitle:'Home'
    })
}

exports.homeproduct=(req,res,next)=>{
   Userblog.find()
   .then(blogs=>{
       console.log(blogs)
       res.render('blog/blogs.ejs',{
           pagetitle:'All Blogs',
           blog:blogs
       })
       next()
   })
   .catch(err=>{
       console.log(err)
   })
   
}

exports.blogdetails=(req,res)=>{
    const bid=req.params.blogid
    Userblog.findById(bid)
    .then(getblog=>{
        console.log(getblog)
        res.render('blog/seemore',{
            pagetitle:'blog',
            blogs:getblog
        })
    })
    .catch()

}
