"use strict";

const validate = require("jsonschema").validate;
const mongoose = require("mongoose");

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
     *  -date: String - 2019-09-14
     */
    getData: (req, res, next) => {
        const date = new Date();
        const date_next = new Date(2019,8,15);
        Measurement.findOne({ created_on: {$gte: date, $lte: date_next} })
            .then(data=>{res.json({data:data});})
            .catch(err=>next(err));
    }
};

module.exports = controller;