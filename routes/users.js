const router = require("express").Router();

router.get('/', (req, res) => {
    res.send("its users route")
})

module.exports = router