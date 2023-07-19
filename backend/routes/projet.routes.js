const {CreateCategory,DeleteCategory,SelectCategory,UpdateCategory} = require('../controllers/category.controller')
const {DeleteAgenda,creationAgenda,getAgenda,updateAgenda} = require('../controllers/organisation.controller')
const {CreatePerm,DeletePerm,UpdatePerm} = require('../controllers/permission.controller')
const {CreateTask,destroyTask,getTask,UpdateTask} = require('../controllers/task.controller')
const {isAuthenticatedUser, hasPerm} = require('../middlewares/auth')
const express = require('express')

const router = express.Router()

/* Dans les futurs implémentation (l'agenda reste malheursement privé pour l'instant) */
// router.route('/permission')
// .delete(isAuthenticatedUser, hasPerm('manager'), DeletePerm)
// .post(isAuthenticatedUser, hasPerm('manager'), CreatePerm)
// .put(isAuthenticatedUser, hasPerm('manager'), UpdatePerm)

router.route('/task')
.delete(isAuthenticatedUser, hasPerm("manager"), destroyTask)
.post(isAuthenticatedUser, hasPerm( "manager"), CreateTask)
.put(isAuthenticatedUser, hasPerm("manager"), UpdateTask)
.get(isAuthenticatedUser, hasPerm("viewer"), getTask)

router.route('/category')
.delete(isAuthenticatedUser, hasPerm("manager"), DeleteCategory)
.post(isAuthenticatedUser, hasPerm("manager"), CreateCategory)
.get(isAuthenticatedUser, hasPerm("viewer"), SelectCategory)
.put(isAuthenticatedUser, hasPerm("manager"), UpdateCategory)

router.route('/main')
.delete(isAuthenticatedUser, hasPerm('manager'), DeleteAgenda)
.put(isAuthenticatedUser, hasPerm('manager'), updateAgenda)
.get(isAuthenticatedUser, hasPerm('viewer'), getAgenda)
.post(isAuthenticatedUser, creationAgenda)



module.exports = router