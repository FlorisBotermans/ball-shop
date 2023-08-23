let express = require('express');
let routes = express.Router();
let inventoryController = require('../controllers/inventory.controller');
let retailerController = require('../controllers/retailer.controller');

routes.post('/inventory/retailer', retailerController.postretailer)
routes.delete('/inventory/retailer/:id', retailerController.deleteretailer);

routes.post('/inventory', inventoryController.postProduct);
routes.delete('/inventory/:id', inventoryController.deleteProduct);

module.exports = routes;