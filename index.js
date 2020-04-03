/*

*/
'user strict'

const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT || 3000
const local = "mongodb://localhost:27017/dbase"
const uat = ''

mongoose.connect(local, (err, res)=>{
if(err){
    return console.log("Error connecting to database: " + err)
}
    console.log("Database connection established")

    app.listen(port, ()=>{
        console.log("API Rest running at http://localhost:" + port)
    })
})
