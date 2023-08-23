const ApiError = require('../models/error.model')
const Retailer = require('../models/retailer.schema')
const Product = require('../models/product.schema')
const mongoose = require('mongoose');
const publisher = require('../message_exchange/publisher')

module.exports = {
    postretailer(req, res, next) {
        const retailer = new Retailer({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name
        })
        retailer.save().then(result => {
            publisher.publishMsg("inventory.retailer.created", result,"RetailerRegistered")
            res.status(200).json(result).end();
        }).catch(err => {
            next(new ApiError("Whoops, an unexpected error occurred: " + err.message, 500));
        })
    },

    deleteretailer(req, res, next) {
        Retailer.findOneAndDelete({_id: req.params.id}).then(result => {
            publisher.publishMsg("inventory.retailer.deleted", result,"RetailerDeleted")
            Product.find({retailer: req.params.id}).then((r) => {
                r.forEach((p) => {
                    console.log(p)
                    publisher.publishMsg("inventory.product.deleted", p)
                })
            })
            Product.deleteMany({retailer: req.params.id})
            .catch(err => {
                next(new ApiError("Something went wrong while deactivating the related products", 404));
            })
            res.status(200).json(result).end(); 
        }).catch(err => {
            next(new ApiError("The retailer you are trying to delete does not exist", 404));
        })
    }
}