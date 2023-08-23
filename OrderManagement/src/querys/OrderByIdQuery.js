const BaseQuery = require('./BaseQuery')

module.exports = class OrderByIdQuery extends BaseQuery {

    constructor(id) {
        super(id)
    }
}
