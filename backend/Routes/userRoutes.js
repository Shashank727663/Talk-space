const express = require('express');

const router = express.Router();

const {register,authUser ,allUsers } = require('../controllers/userControllers')

const {protect} = require('../middlewares/authMiddleware')
//for chaining mulltiple requests

router.route('/').post(register).get(protect , allUsers)
router.route('/login').post(authUser);

module.exports = router;