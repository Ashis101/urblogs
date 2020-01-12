const express=require('express')
const route=express.Router()
const usercontroller=require('../controller/usersblog')
const routepro=require('../routeprotect/routeprotect')
const {body}=require('express-validator')

route.get('/addblogs',routepro,usercontroller.getaddblog)
route.get('/myblogs',routepro,usercontroller.getmyblog)
route.post('/addblogs',[
  body('title')
  .isString()
  .isLength({ min: 3 })
  .withMessage('title has to be 3 characters')
  .trim(),
  body('summery')
  .isString()
  .isLength({ min: 3 })
  .withMessage('Summery has to be 3 characters')
  .trim(),

  ],routepro,usercontroller.postaddblog)
route.get('/blogs/edit/:id',routepro,usercontroller.getedit)
route.post('/blogs/edit/:id',[
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('title has to be 3 characters')
      .trim(),
      body('summery')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Summery has to be 3 characters')
      .trim(),
    body('details')
      .isLength({ min: 5, max: 400 })
      .withMessage('Details has to be Minimum 5 character to 400 character')
      .trim()
  ],routepro,usercontroller.postedit)
route.post('/blogs/delete/:del',routepro,usercontroller.postdetete)

module.exports=route