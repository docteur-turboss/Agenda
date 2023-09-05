const {deleteUser,getUser,login,logout,passwordForgot,signup,updateProfile} = require('../controllers/user.controller')
const {isAuthenticatedUser} = require('../middlewares/auth')
const {limiterUser} = require('../middlewares/rate-limit')
const express = require('express')

const router = express.Router()

router.route('/sign/up').post(limiterUser, signup)
router.route('/sign/in').post(limiterUser, login)
router.route('/sign/out').post(isAuthenticatedUser, logout)

router.route('/update/profile')
.put(limiterUser, isAuthenticatedUser, updateProfile)

router.route('/@me').get(isAuthenticatedUser, getUser)

router.route('/password/forgot').post(limiterUser, passwordForgot)

router.route('/@me/destroy').delete(isAuthenticatedUser, deleteUser)

module.exports = router