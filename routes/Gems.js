const router = require('express').Router()

let GemsController = require('../controllers/Gems')
const VerifyToken = require('../middleware/VerifyToken')
const multipart = require('connect-multiparty')
router.get('/getGems',VerifyToken ,GemsController.getGems)

router.post('/getGems',VerifyToken ,GemsController.getGems)

router.post('/addGem',VerifyToken ,GemsController.createGem)

router.post('/getGem',VerifyToken ,GemsController.getGem)

router.post('/UpdateGem',VerifyToken ,GemsController.updateGem)

router.post('/deleteGem',VerifyToken ,GemsController.deleteGem)
module.exports = router