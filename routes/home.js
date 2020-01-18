const express=require('express')
const route=express.Router()
const blogcontroller=require('../controller/home')
const routepro=require('../routeprotect/routeprotect')


route.get('/',blogcontroller.home)

route.get('/blogs',blogcontroller.homeproduct)

route.get('/blogs/:blogid',routepro,blogcontroller.blogdetails)

route.get('/search',blogcontroller.getsearch)
route.post('/search',blogcontroller.postsearch)
route.get('/about',(req,res)=>{
    res.render('about')
})

module.exports=route

