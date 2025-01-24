const express = require('express')
const connectDb = require('./db/connectdb')
const app = express()
const port = 3000
const web = require('./routes/web')

const cookieParser = require('cookie-parser')
app.use(cookieParser())

//image upload
const fileUpload = require('express-fileupload')

//image upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir:'/tmp/',
}));

// app.use(cookieParser())

// connection
connectDb()

app.use(express.json())



// http://localhost:3000/api/

// routerload
app.use('/api',web)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})