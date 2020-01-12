const express=require('express')
const route=express.Router()
const blogcontroller=require('../controller/home')
const routepro=require('../routeprotect/routeprotect')


route.get('/',blogcontroller.home)

route.get('/blogs',blogcontroller.homeproduct)

route.get('/blogs/:blogid',routepro,blogcontroller.blogdetails)



module.exports=route

