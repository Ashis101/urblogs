const mongoose=require('mongoose')

const authschema=mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    resettoken:{type:String},
    resettokenexpire:{type:Date}
})

module.exports=mongoose.model('Users',authschema)
