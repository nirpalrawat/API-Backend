 const mongoose = require('mongoose')
const Local_Url = 'mongodb://127.0.0.1:27017/API'
const connectDb = () => {
    return mongoose.connect(Local_Url)
        .then(() => {
            console.log('connect db')
        }).catch((error) => {
            console.log(error)
        })
}
module.exports = connectDb