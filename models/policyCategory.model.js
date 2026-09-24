const mongoose = require('mongoose');

const PolicyCategorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required: true,
        unique: true,
        trim: true
    }
},{timestamps:true});

module.exports = mongoose.model('PolicyCategory', PolicyCategorySchema);