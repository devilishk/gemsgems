module.exports = { //es la variable que sube los modulos para exportarlos
    getGems,
    getGemsPagination,
    getGem,
    createGem,
    updateGem,
    deleteGem,
    uploadPhotos,
    updateGemWithImages,
}

const GemsSub = require('../Models/Gems')     //aqui estan las constantes con sus rutas
const mongoose = require('mongoose')
const meteorID = require('meteor-mongo-id')
const Random = require('meteor-random')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({ //aqui tenemos las credenciales del cloudinary para poder subir imagenes
    cloud_name:'dpiwqviot',
    api_key:'981823885591179',
    api_secret:'AKYWsz5Ky3AR-BcTHHAn1dAn2Rg'

})

function getGems(req, res) { //funcion que trae a el objeto para su ejecucion y permite la busqueda de una gema que haya sido agregada recientemente
    GemsSub.find({}, (err, concepts) => {
        if (err) return res.status(500).send({ message: `Problem with the searching request ${err}` })
        if (!concepts) return res.status(404).send({ message: `Gems does not exist` })
        res.status(200).send({ gems: concepts })
    })
}

function getGemsPagination(req, res) { //esta parte del codigo es para que cuando se hacen llamadas no sean dificiles de manejar
    let perPage = parseInt(req.body.perPage)
    let page = parseInt(req.body.page)
    let gemsConceptsRes = null;

    let searchData = req.query.search

    GemsSub.find(searchData).skip((page - 1) * perPage)
        .limit(perPage)
        .sort({})
        .exec()
        .then((concepts) => {
            res.set('X-limit', perPage)
            res.set('X-page', page)
            gemsConceptsRes = concepts
            console.info("Result", concepts)
            return GemsSub.count()
        })
        .then((total) => {
            res.set('X-total', total)
            res.status(200).send({ total: total, gemsTotal: gemsConceptsRes.length, gemsConcepts: gemsConceptsRes })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: `Error in request ${err}` })
        })
}

function getGem(req, res) {
    let conceptID = req.body._id
    GemsSub.find({ _id: conceptID }, (err, concept) => {
        if (err) return res.status(500).send({ message: `Problem with the searching request ${err}` })
        if (!concept) return res.status(404).send({ message: `Gem does not exist` })
        res.status(200).send({ gem: concept })
    })

}

function createGem(req, res) { //aqui se crea la gema con los parametros
    let gem = req.body
    let g = {

        _id: Random.id(),

        name: gem.name, //aqui agregamos descripcion, precio, nombre y si esta a la venta 
        description: gem.description,
        price: gem.price,
        canPurchase: gem.canPurchase,

        specs: { //aqui agregamos aristas de la gema, color, rareza y brillo
            faces: gem.specs.faces,
            color: gem.specs.color,
            rarity: gem.specs.rarity,
            shine: gem.specs.shine
        },

        reviews: [{ //esta parte es para los reviews de las gemas, donde se agregan estrellas, la fecha, el cuerpo del mensaje y el autor
            stars: gem.reviews.stars,
            body: gem.reviews.body,
            author: gem.reviews.author,
            createdOn: formatDateName(new Date())
        }]

    }

    const gemToCreate = new GemsSub(g)

    gemToCreate.save((err, gemStored) => {
        if (err) return res.status(400).send({ message: `Error on model ${err}` })

        res.status(200).send({ gem: gemStored })
    })
}

function updateGem(req, res) { //aqui se actualizan las gemeas utlizando el id y el request del body
    let conceptID = req.body._id
    let update = req.body.gem

    /*CarsSub.findOne({_id: conceptID}, (err, conceptCar)=>{
        if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        if(!conceptCar) return res.status(404).send({message: 'The car does not exist'})

    })*/

    GemsSub.findByIdAndUpdate(conceptID, update, (err, concept) => {
        if (err) return res.status(500).send({ message: `Problem with the searching request ${err}` })
        res.status(200).send({ message: `Update Successfull`, gem: concept })
    })

}

function updateGemWithImages(_id, img) { //actualizar la gema con la propiedad de tener una imagen
    let conceptID = _id
    let update = img

    GemsSub.findByIdAndUpdate(conceptID,
        { "$push": { "images": update } },
        { "new": true, "upsert": true },
        (err, conceptUpdate) => {
            if (err) return res.status(500).send({ message: `Error in the request ${err}` })
            console.log("Gem update", conceptUpdate)
        })


}

function deleteGem(req, res) { //funcion para borrar la gema 
    const conceptID = req.body._id


    GemsSub.remove({ _id: conceptID }, (err, concept) => {
        if (err) return res.status(500).send({ message: `Problem with the searching request ${err}` })
        res.status(200).send({ message: `Delete Successfull`, gem: concept })
    })

}

function uploadPhotos(req, res) { //funcion que nos permite subir foto a traves de cloudinary

    const path = req.files.file.path
    console.log(path)
    const uniqueFilename = Random.id()
    const gemID = req.body._id
    fs.readFile(path, function (err, data) {
        if (err) { throw err }
        cloudinary.uploader.upload(path, { public_id: `gemsImages/${uniqueFilename}`, 
        tags: `gemsImages`},
        (err, result)=> {
                console.log(result);
            let routeImg = result.url
            let arrayRoute = routeImg.split("/")
            let finalUrl = arrayRoute[6] + "/" + arrayRoute[7] + "/" + arrayRoute[8]
          if(err) return res.status(500).send(err)
            fs.unlinkSync(path)
            updateGemWithImages(gemID, finalUrl)
            res.status(200).send({message: "upload image sucess",
            imageData: result})
        })
    })



}

function formatDateName(now) { //funcion para que exista una hora visible 
    let year = now.getFullYear()
    let month = now.getMonth() < 9 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
    let day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()
    let hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
    let minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
    let seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()

    return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`
} 