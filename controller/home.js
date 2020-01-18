const Userblog=require('../model/userblog')


exports.home=(req,res)=>{
    res.render('home',{
        pagetitle:'Home'
    })
}

exports.homeproduct=(req,res,next)=>{
   Userblog.find()
   .then(blogs=>{
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
let data=[]
exports.getsearch=(req,res,next)=>{
    console.log(data)
    if (data.length > 0) {
        res.render('search',{
            pagetitle:'Search ',
            data:data

        })
    }


}

exports.postsearch=(req,res,next)=>{
    const search=req.body.search
    Userblog.find({title:search})
    .then(result=>{
        data.push(...result)
        return res.redirect('/search')
    })
    .catch(err=>console.log(err))
   



}