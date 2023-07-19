const {deleteUser,getUser,login,logout,passwordForgot,signup,updateProfile} = require('../controllers/user.controller')
const {isAuthenticatedUser} = require('../middlewares/auth')
const express = require('express')

const router = express.Router()

router.route('/sign/up').post(signup)
router.route('/sign/in').post(login)
router.route('/sign/out').post(isAuthenticatedUser, logout)

router.route('/update/profile')
.put(isAuthenticatedUser, updateProfile)

router.route('/@me').get(isAuthenticatedUser, getUser)

router.route('/password/forgot').post(passwordForgot)

router.route('/@me/destroy').delete(isAuthenticatedUser, deleteUser)

module.exports = router