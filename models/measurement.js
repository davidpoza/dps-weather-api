"use strict";

const mongoose    = require("mongoose");
const Schema      = mongoose.Schema;

const LogSchema = Schema({
    temperature     : Number,
    humidity        : Number,
    pressure        : Number,
    wind            : Number,
    rain            : Boolean,
    uvi             : Number,
    notes           : String,
    created_on      : Date,
});

LogSchema.pre("save", function(next){
    this.created_on = new Date();
    return next();
});

module.exports = mongoose.model("Measurement", LogSchema, "measurements");