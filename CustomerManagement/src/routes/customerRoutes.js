const express = require('express')
const router = express.Router()
const CustomerController = require('../controllers/CustomerController')

const customerController = new CustomerController()

router.post("",async (req,res)=>{
    try{
        newCustomer = await customerController.postCustomer(req, res)

    } catch(e){
        console.log(e)
        res.status(500).send({ status: 'error', error: 'Something went wrong' })
        return
    }
    res.send({status: "succes", newCustomer})
})

router.put("/:id",async (req,res)=>{
    try{
        updatedCustomer = await customerController.putCustomer(req, res)
    } catch(e){
        console.log(e)
        res.status(500).send({ status: 'error', error: 'Something went wrong' })
        return
    }
    res.send({status: "succes", updatedCustomer})
})

router.delete("/:id",async (req,res)=>{
    try{
        deletedCustomer = await customerController.deleteCustomer(req, res)
    } catch(e){
        console.log(e)
        res.status(500).send({ status: 'error', error: 'Something went wrong' })
        return
    }
    res.send({status: "succes", deletedCustomer})
})

module.exports = router;