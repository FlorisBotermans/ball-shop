const express = require('express')
const router = express.Router()
const CommandController = require('../controllers/CommandController')
const OrderRegisteredCommand = require('../commands/OrderRegisteredCommand')
const AddOrderDeliveryCompanyCommand = require('../commands/AddOrderDeliveryCompanyCommand')
const StatusByOrderIdIdQuery = require('../querys/OrderByIdQuery')
const QueryController = require('../controllers/QueryController')

const commandController = new CommandController()
const queryController = new QueryController()

router.post("",async (req,res)=>{
    const command = new OrderRegisteredCommand(
        new Date().getTime(),
        req.body.ordernumber || '',
        req.body.orderdate || '',
        req.body.customerID,
        req.body.deliveryadress || '',
        req.body.products,
        req.body.paymentType || ''
    )
    let newOrderCreated;
    if(command.products.length < 1 || command.products.length > 20)
    {
        res.status(500).send({ status: 'error', error: 'order products mag niet leeg zijn of meer dan 20 items bevatten!' })
    }
    else{
        try{
            newOrderCreated = await commandController.OrderRegisteredCommand(command)
        } catch(e){
            console.log(e)
            res.status(500).send({ status: 'error', error: 'Something went wrong' })
            return
        }
        res.send({status: "succes",newOrderCreated})
    }


})
router.put("/:id/logisticCompany", async(req,res) =>{
    const command = new AddOrderDeliveryCompanyCommand(
        new Date().getTime(),
        req.params.id
    )
    try{
        order = await commandController.addOrderDeliveryCompanyCommand(command)
    } catch(e){
        console.log(e)
        res.status(500).send({ status: 'error', error: 'Something went wrong' })
        return
    }
    res.send({status: "succes",order})
})
router.get("/:id/status", async(req,res) =>{
    const query = new StatusByOrderIdIdQuery(
        req.params.id
    )
    try{
        order = await queryController.OrderByIdQuery(query)
    } catch(e){
        console.log(e)
        res.status(500).send({ status: 'error', error: 'Something went wrong' })
        return
    }
    res.send(order.orderStatus)
})

module.exports = router;