const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res
    .status(200)
    .json({ data: "shop", message: "shop page" });
})

module.exports = router;
