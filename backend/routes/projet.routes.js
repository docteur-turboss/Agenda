const {CreateCategory,DeleteCategory,getCategory,UpdateCategory} = require('../controllers/category.controller')
const {DeleteAgenda,CreationAgenda,getAgenda,updateAgenda} = require('../controllers/organisation.controller')
const {CreateTask,destroyTask,getTask,UpdateTask} = require('../controllers/task.controller')
const {isAuthenticatedUser, hasPerm} = require('../middlewares/auth')
const {limiterOrganisation, limiterTask, limiterCategory} = require('../middlewares/rate-limit')

const express = require('express')

const router = express.Router()

/* Dans les futurs implémentation (l'agenda reste malheursement privé pour l'instant) */
// router.route('/permission')
// .delete(isAuthenticatedUser, hasPerm('manager'), DeletePerm)
// .post(isAuthenticatedUser, hasPerm('manager'), CreatePerm)
// .put(isAuthenticatedUser, hasPerm('manager'), UpdatePerm)

router.route('/task')
.post(limiterTask, isAuthenticatedUser, hasPerm( "manager"), CreateTask)
.put(limiterTask, isAuthenticatedUser, hasPerm("manager"), UpdateTask)
.delete(isAuthenticatedUser, hasPerm("manager"), destroyTask)
.get(isAuthenticatedUser, hasPerm("viewer"), getTask)

router.route('/category')
.post(limiterCategory, isAuthenticatedUser, hasPerm("manager"), CreateCategory)
.put(limiterCategory, isAuthenticatedUser, hasPerm("manager"), UpdateCategory)
.delete(isAuthenticatedUser, hasPerm("manager"), DeleteCategory)
.get(isAuthenticatedUser, hasPerm("viewer"), getCategory)

router.route('/main')
.put(limiterOrganisation, isAuthenticatedUser, hasPerm('manager'), updateAgenda)
.post(limiterOrganisation, isAuthenticatedUser, CreationAgenda)
.delete(isAuthenticatedUser, hasPerm('manager'), DeleteAgenda)
.get(isAuthenticatedUser, hasPerm('viewer'), getAgenda)

module.exports = router