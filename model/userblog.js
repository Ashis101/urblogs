const mongoose=require('mongoose')

const Schema = mongoose.Schema;

const blogschema=new Schema({
    imageUrl: {
        type: String,
        required: true
      },
    title: {
        type: String,
        required: true
      },
    summery: {
        type: String,
        required: true
      },
    description: {
        type: String,
        required: true
      },
    userid:{
      type:Schema.Types.ObjectId,
      ref:'Users',
    }  

})



module.exports=mongoose.model('Userblog',blogschema)