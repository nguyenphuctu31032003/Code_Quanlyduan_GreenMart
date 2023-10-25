const mongoose = require('mongoose')

async function connect () {
    try{
        await mongoose.connect('mongodb://localhost:27017/books_library',{
            useNewUrlParser: true,
            useUnifiedTopology:true
        });
        console.log("Connect successfully")
    }catch (err){
        console.log(err)
    }
}

module.exports={connect}
