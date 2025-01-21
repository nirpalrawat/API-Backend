const express = require('express')
const connectDb = require('./db/connectdb')
const app = express()
const port = 3000
const web = require('./routes/web')
//image upload
const fileUpload = require('express-fileupload')

//image upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir:'/tmp/',
}));

// connection
connectDb()

app.use(express.json())



// http://localhost:3000/api/

// routerload
app.use('/api',web)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})