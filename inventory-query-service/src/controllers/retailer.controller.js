const conn = require('../handlers/database.handler');
const ApiError = require('../models/error.model')

module.exports = {
    getretailer(req, res, next) {
        conn.query('SELECT * FROM retailer', 
        function(error, results, fields) {
            if (error) next(new ApiError("Something went wrong while trying to get the retailers", 500))
            else if (results.length == 0) next(new ApiError("No retailer could be found", 404))
            else res.status(200).json(results).end();
        })
    },

    getOneretailer(req, res, next) {
        conn.query('SELECT * FROM retailer WHERE _id = ? LIMIT 1;', 
        [req.params.id], function(error, results, fields) {
            if (error) next(new ApiError("Something went wrong while trying to get the retailer", 500))
            else if (results.length == 0) next(new ApiError("retailer with the given ID could not be found", 404))
            else res.status(200).json(results[0]).end();
        })
    }
}