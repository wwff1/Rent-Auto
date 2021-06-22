const {Schema, model} = require('mongoose')
const Float = require('mongoose-float').loadType(require('mongoose'));


const schema = new Schema({
    date_start: {date_start: String,},
    date_end: {date_end: String,},
    client: [{
        fio: String,
        passport: String,
        experience:Number,
        number: String
    }],
    auto: {
        auto: String,
    },
    sum: { type: Float, required: true}
})

module.exports = model('Order', schema)