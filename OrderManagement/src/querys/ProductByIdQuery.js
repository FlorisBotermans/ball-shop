const BaseQuery = require('./BaseQuery')

module.exports = class ProductByIdQuery extends BaseQuery {

    constructor(id) {
        super(id)
    }
}
