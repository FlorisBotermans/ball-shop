let express = require('express');
let routes = express.Router();
let inventoryController = require('../controllers/inventory.controller');
let retailerController = require('../controllers/retailer.controller');

routes.get('/inventory/retailer', retailerController.getretailer);
routes.get('/inventory/retailer/:id', retailerController.getOneretailer);

routes.get('/inventory', inventoryController.getProducts)
routes.get('/inventory/:id', inventoryController.getOneProduct);

module.exports = routes;