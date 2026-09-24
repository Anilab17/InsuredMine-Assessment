const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountName:{
        type: String,
        required: true,
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
},{timestamps:true});

module.exports = mongoose.model('Account', accountSchema);