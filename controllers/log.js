'use strict';

const validate = require('jsonschema').validate;
const mongoose = require('mongoose');
const moment   = require('moment-timezone');

const Measurement   = require('../models/measurement');
const error_types   = require('../middleware/error_types');
const valid_schemas = require('../utils/valid_schemas');
const utils         = require('../utils/utils');

let controller = {




    /**
     * Parameters via body:
     *  @param {number} temperature - 21.2
     *  @param {number} humidity - 57.8
     *  @param {number} pressure - 1024.5
     *  @param {ßtring} station_id - HOME_INDOOR
     */
    logData: (req, res, next) => {
        //let validation = validate(req.body, valid_schemas.create_task);
        //if(!validation.valid)
        //    throw validation.errors;
        let document = Measurement({
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            pressure: req.body.pressure,
            wind: req.body.wind,
            station_id: req.body.station_id,
        });


        document.save()
            .then(data=>{
                res.json(data = {
                    _id: data._id,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    pressure: data.pressure,
                    wind: data.wind,
                    station_id: data.station_id,
                    created_on: moment(data.created_on).tz('Europe/Madrid').format('DD-MM-YYYY HH:mm:ss'),
                });
            })
            .catch(err=>next(err));
    },

    /**
     * Parameters via query:
     *  @param {string} date - 2019-09-14
     *  @param {ßtring} station_id - HOME_INDOOR
     */
    getData: (req, res, next) => {
        const date = new moment.tz(req.params.date, 'YYYY-MM-DD', 'Europe/Madrid').valueOf();
        const date_next = new moment.tz(date, 'Europe/Madrid').add(24, 'hours').valueOf();
        Measurement.find({ station_id: req.params.station_id, created_on: {$gte: date, $lte: date_next} })
            .then(data=>{
                res.json(data.map(d=>(
                    {
                        _id: d._id,
                        temperature: d.temperature,
                        humidity: d.humidity,
                        pressure: d.pressure,
                        wind: d.wind,
                        station_id: d.station_id,
                        created_on: moment(d.created_on).tz('Europe/Madrid').format('DD-MM-YYYY HH:mm:ss'),
                    }
                )));
            })
            .catch(err=>next(err));
    },

    getLastData: (req, res, next) => {
        Measurement.findOne({ station_id: req.params.station_id })
        .sort({'created_on': 'descending'})
        .limit(1)
        .then(data=>{
            if (!data) {
                throw new error_types.Error404("There are no measurements.");
            }
            res.json(
                {
                    _id: data._id,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    pressure: data.pressure,
                    wind: data.wind,
                    station_id: data.station_id,
                    created_on: moment(data.created_on).tz('Europe/Madrid').format('DD-MM-YYYY HH:mm:ss'),
                }
            );
        })
        .catch(err=>next(err));
    },

    /**
     * Get the nearest measurement to the hour passed, looking for in a range of +-10 minutes.
     * Parameters via query:
     *  @param {string} date - YYYY-MM-DD HH:mm
     *  @param {ßtring} station_id - HOME_INDOOR
     */
    getNearestData: (req, res, next) => {
        const date = new moment.tz(req.params.date, 'YYYY-MM-DD HH:mm', 'Europe/Madrid');
        const max = date.add(10, 'minutes').valueOf();
        const min = date.subtract(20, 'minutes').valueOf(); //we substract 20 because add mutates object
        date.add(10, 'minutes').valueOf(); //keep original date
        Measurement.find({ station_id: req.params.station_id, created_on: {$gte: min, $lte: max}})
        .then(data=>{
            if (!Array.isArray(data) || data.length === 0) {
                throw new error_types.Error404("There are no measurements.");
            }
            let diff = 10*60; // range amplitude in seconds
            console.log("diff inicial",diff )
            let index = 0;
            data.forEach((m, i) => {
                const currMeasurementDate = moment.tz(m.created_on, 'Europe/Madrid');
                if (Math.abs(date.diff(currMeasurementDate, 'seconds')) < diff) {
                    diff = Math.abs(date.diff(currMeasurementDate, 'seconds'));
                    index = i;
                }
            });
            res.json(
                {
                    _id: data[index]._id,
                    temperature: data[index].temperature,
                    humidity: data[index].humidity,
                    pressure: data[index].pressure,
                    wind: data[index].wind,
                    station_id: data[index].station_id,
                    created_on: moment(data[index].created_on).tz('Europe/Madrid').format('DD-MM-YYYY HH:mm:ss'),
                }
            )
        })
        .catch(err=>next(err));
    },
};

module.exports = controller;