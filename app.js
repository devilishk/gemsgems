'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const gems = require('./routes/gems')
const auth = require('./routes/auth')

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', (req, res)=>{
    res.send("Hola mundo3333")

})
/*app.use('/auth', auth)
app.use('/cars', gems)*/
module.exports = app 
