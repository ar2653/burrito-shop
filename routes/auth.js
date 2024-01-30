const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    res
    .status(200)
    .json({ data: "jwt", message: "auth page working" });
})

module.exports = router;