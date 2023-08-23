const conn = require('../handlers/database.handler');
const ApiError = require('../models/error.model')

module.exports = {
    getProducts(req, res, next) {
        conn.query('SELECT `_id`, `name`, `description`, `price`, `amount`, `retailer` FROM product WHERE active = true;', 
        function(error, results, fields) {
            if (error) next(new ApiError("Something went wrong while trying to get the products", 500))
            else if (results.length == 0) next(new ApiError("No products could be found", 404))
            else res.status(200).json(results).end();
        })
    },

    getOneProduct(req, res, next) {
        conn.query('SELECT * FROM product WHERE _id = ? LIMIT 1;', 
        [req.params.id], function(error, results, fields) {
            if (error) next(new ApiError("Something went wrong while trying to get the products", 500))
            else if (results.length == 0) next(new ApiError("Product with the given ID could not be found", 404))
            else res.status(200).json(results[0]).end();
        })
    },
    deleteProducts(req, res, next) {
        conn.query('DELETE FROM product');
    }
}