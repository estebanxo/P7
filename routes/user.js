const express = require('express');
const router = express.Router();
const controleEmail = require('../middleware/controleEmail');
const controlePassword = require('../middleware/controlePassword');

const userCtrl = require('../controllers/user');

router.post('/signup', controleEmail, controlePassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;