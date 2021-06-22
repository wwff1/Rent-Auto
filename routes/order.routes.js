const {Router} = require('express')
const Order = require('../models/Order')
const router = Router()

router.get("/all", function(req, res){
    Order.find((err, client) => {
        if(res.status(200)) {
            console.log("server")
            res.send(client)
        }
    })
});

module.exports = router