"use strict";

const validate = require("jsonschema").validate;
const mongoose = require("mongoose");
const moment   = require("moment-timezone");

const Measurement   = require("../models/measurement");
const error_types   = require("../middleware/error_types");
const valid_schemas = require("../utils/valid_schemas");
const utils         = require("../utils/utils");

let controller = {




    /**
     * Parameters via body:
     *  -temperature: {String}
     *  -humidity: {String}
     *  -pressure: {String}
     *  -station_id: {String}
     */
    logData: (req, res, next) => {
        //let validation = validate(req.body, valid_schemas.create_task);
        //if(!validation.valid)
        //    throw validation.errors;
        let document = Measurement({
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            pressure: req.body.pressure,
            station_id: req.body.station_id,
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
     *  -station_id : {String} - HOME_INDOOR
     */
    getData: (req, res, next) => {
        const date = new moment(req.params.date, "YYYY-MM-DD").valueOf();
        const date_next = new moment(date).add(24, "hours").valueOf();
        Measurement.find({ station_id: req.params.station_id ,created_on: {$gte: date, $lte: date_next} })
            .then(data=>{
                res.json(data.map(d=>(
                    {
                        _id: d._id,
                        temperature: d.temperature,
                        humidity: d.humidity,
                        pressure: d.pressure,
                        station_id: d.station_id,
                        created_on: moment(d.created_on).tz('Europe/Madrid').format("DD-MM-YYYY HH:mm:ss"),
                    }
                )));
            })
            .catch(err=>next(err));
    }
};

module.exports = controller;