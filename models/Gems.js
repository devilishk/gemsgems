const mongoose = require('mongoose')
const Schema = mongoose.Schema
const meteorID = require('meteor-mongo-id')
const Random = require('meteor-random')

const ReviewSchema = Schema({//Esto es un arreglo que tiene 4 propiedades, pertenece al esquema de gema
    stars: {
        type: Number,
        allowedValues:[5,4,3,2,1]
    },
    body:{
        type:String
    },
    author: {
        type: String
    },
    createdOn: {
        type: String
    }
})

const SpecsSchema = Schema ({//esquema de la caracteristica de la gema
    faces: { type: Number },
    color: { type: String },
    
    rarity: { 

    type: Number,
    allowedValues : [1,2,3,4,5,6,7,8,9,10] },
    
    shine: { 
    type: Number,
    allowedValues : [1,2,3,4,5,6,7,8,9,10] }
})

const GemsSchema = Schema({//aqui nos dice como debera ser insertada la gema en la base de datos a traves del PostMan esta hace uso de los esquemas anteriores

    _id:{
        type:String
    },

    name: { type: String },
    description: { type: String },
    price: { type: Number },
    canPurchase: { type: Boolean },
    specs: {
        type: SpecsSchema
    },

    images: {
        type: [String],
    },

    reviews:{
        type:[ReviewSchema]
    }
    

})


module.exports = mongoose.model('Gems', GemsSchema)