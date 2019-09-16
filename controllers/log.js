"use strict";

const validate = require("jsonschema").validate;
const mongoose = require("mongoose");
const moment   = require("moment");

const Measurement   = require("../models/measurement");
const error_types   = require("../middleware/error_types");
const valid_schemas = require("../utils/valid_schemas");
const utils         = require("../utils/utils");

let controller = {




    /**
     * Parameters via body:
     *  -desc: String
     *  -date: String
     *  -start_hour: String
     *  -end_hour: String
     *  -tags: [ObjectId]
     *  -project: ObjectId
     *  -hour_value: float
     */
    logData: (req, res, next) => {
        //let validation = validate(req.body, valid_schemas.create_task);
        //if(!validation.valid)
        //    throw validation.errors;
        console.log(req.body);
        let document = Measurement({
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            pressure: req.body.pressure,
        });


        document.save()
            .then(data=>{
                res.json({data:data});
            })
            .catch(err=>next(err));
    },

    /**
     * Parameters via query:
     *  -date: {String} - 2019-09-14
     */
    getData: (req, res, next) => {
        const date = new moment(req.params.date, "YYYY-MM-DD").valueOf();
        const date_next = new moment(date).add(24, "hours").valueOf();
        Measurement.find({ created_on: {$gte: date, $lte: date_next} })
            .then(data=>{res.json({data:data});})
            .catch(err=>next(err));
    }
};

module.exports = controller;