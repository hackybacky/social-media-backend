const router = require("express").Router();

router.get('/', (req, res) => {
    res.send("its auth route")
})

module.exports = router