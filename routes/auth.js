let router = require('express').Router()

const AuthController = require('../Controllers/Auth')
const VerifyToken = require('../Middleware/VerifyToken')

router.post('/login', AuthController.loginUser)
router.post('/logout', AuthController.logoutUser)
router.post('/me', AuthController.getCurrentUser)
router.post('/signup', AuthController.signInUser)




module.exports = router