module.exports = {
    getGems,
    getGem,
    createGem,
    getGemsPagination,
    updateGem,
    deleteGem
}

const GemsSub = require('../models/Gems')
const mongoose = require('mongoose')
const meteorID = require('meteor-mongo-id')
const Random = require('meteor-random')
const cloudinary = require('cloudinary').uv2
const fs = require('fs')
cloudinary.config({
    cloud_name:'dpiwqviot',
    api_key: '981823885591179',
    api_secret: 'AKYWsz5Ky3AR-BcTHHAn1dAn2Rg'

})
function getGems(req, res){
    GemsSub.find({}, (err, concepts)=>{
        if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        if(!concepts) return res.status(404).send({message: `Gems does not exist`})

        res.status(200).send({gems: concepts})
    })
}
function getGem(req, res){
    let conceptID = req.body._id
    GemsSub.find({_id: conceptID}, (err, concept)=>{
        if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        if(!concept) return res.status(404).send({message: `Gem does not exist`})

        res.status(200).send({gem: concept})
    })


}
function getGemsPagination(req, res){
    let perPage = parseInt(req.body.perPage)
    let page = parseInt(req.body.page)
    let gemsConceptsRes = null;
    
    let searchData = req.query.search

    GemsSub.find(searchData).skip((page -1) * perPage)
    .limit(perPage)
    .sort({})
    .exec()
    .then((concepts)=>{
        res.set('X-limit', perPage)
        res.set('X-page',page)
        gemsConceptsRes = concepts
        console.info("Result", concepts)
        return GemsSub.count()
    })
    .then((total)=>{
        res.set('X-total', total)
        res.status(200).send({ total: total, job, gemsTotal: gemsConceptsRes.length, gemsConcepts: gemsConceptsRes})
        
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send({message: `Error in request ${err}`})
    })
}

function createGem(req, res){
    let gem = req.body
    console.log(req.body.specs)
    let g = {
        name: gem.name,
        description: gem.description,
        price: gem.price,
        canPurchase: gem.canPurchase,
        specs:{
            faces: gem.faces,
            color: gem.specs.color,
            rarity: gem.specs.rarity,
            shine: gem.specs.shine
        },
        review:[{
            stars: gem.review.stars,
            body: gem.review.body,
            author: gem.review.author,
            createdOn: formatDatename (new Date ())
    }]
}
    const gemToCreate = new GemsSub(g)

    gemToCreate.save((err, gemStored)=>{
        if(err) return res.status(400).send({message: `Error on model ${err}`})

        res.status(200).send({gem: gemStored})
    })

}

function updateGem(req, res){
    let conceptID = req.body._id
    let update = req.body.gem
   
    /*CarsSub.findOne({_id: conceptID}, (err, conceptCar)=>{
        if(err) return res.status(500).send({message: `Problem with the searching request %{err}`})
        if(!conceptCar) return res.status(404).send({message: 'The car does not exist'})
    })*/
    GemsSub.findByIdAndUpdate(conceptID, update, (err, concept)=>{
        if (err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        res.status(200).send({message: `Update Successfull`, gem: concept})
    })
    
}
function updateGemWithImages(req, res){
    let conceptID = req.body._id
    let update = req.body.img
   

    GemsSub.findByIdAndUpdate(conceptID, 
        {"$push": {"images": update}},
        {"new": true, "upsert": true},
        (err, conceptUpdated)=>{
            if (err) res.status(500).send({message: `Error in the request ${err}`})
            console.log("Gem updated", conceptUpdated)
        })
        }



function deleteGem(req,res){
    const conceptID = req.body._id

    GemsSub.remove({_id: conceptID}, (err, concept)=>{
        if (err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        res.status(200).send({message: `Remove completed`})
    })

}
function uploadPhotos(req,res){

    const path = req.files.file.path
    console.log(typeof path)
    const uniqueFilename = Random.id(
        fs.readFile(path, function (err, data){
            if (err) { throw err}
            cloudinary.uploader.upload(path, { public_id: `gemsImages/${uniqueFilename}`},
            tags: `gemsImage`},
            (err, result)=> {
                console.log(result)
                if(err) return res.status(500).send(err)
                fs.unlinkSync(path)
                updateGemWithImages()
                res.status(200).send({message: "upload image success",
                imageDate: result})
            })
        })
    )


function formatDatename(now){
    let year = now.getFullYear()
    let month = now.getMonth() < 9 ? `0${now.getMonth() + 1 }` : now.getMonth() + 1
    let day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()
    let hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
    let minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
    let seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()

    return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`
}