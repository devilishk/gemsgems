const router = require('express').Router()

const GemsController = require('../Controllers/Gems')
const VerifyToken = require('../middleware/VerifyToken')
const multipart = require('connect-multiparty')

router.get('/getgems', VerifyToken, GemsController.getGems)

router.post('/getgems' , VerifyToken, GemsController.getGems)

router.post('/addGem', GemsController.createGem)

router.post('/getGem', VerifyToken, GemsController.getGem)

router.post('/updategem', VerifyToken, GemsController.updateGem)

router.post('/deletegem', VerifyToken, GemsController.deleteGem)

router.use(multipart({
    uploadDir: 'tmp'
}))

router.post('/uploadPhoto', GemsController.uploadPhotos)

module.exports = router
