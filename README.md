# AvansBal.com
Bal.com casus mock retail store

## CustomerManagementService
API POST endpoint:  
http://localhost:5100/Customer  
Body:  
{  
  "username": "string",  
  "password": "string",  
  "firstname": "string",  
  "lastname": "string",  
  "email": "string",  
  "city": "string",  
  "street": "string",  
  "housenumber": 0,  
  "telephone": "string",  
  "role": "string"  
}  
  
Response:  
  
{  
  "id": 8,  
  "username": "string",  
  "password": "string",  
  "firstname": "string",  
  "lastname": "string",  
  "email": "string",  
  "city": "string",  
  "street": "string",  
  "housenumber": 0,  
  "telephone": "string",  
  "role": "string"  
}  

*If body is just "{}" or firstname field is empty it will call a random user API to generate a user for you.* 

============  
Event fired when Customer registered:

Queue: CustomerManagementService  

headers:  
MessageType:    CustomerRegistered

Payload:  
{
"timestamp":"2021-05-05T13:07:06.9654516+00:00",  
"data":"  
{  
"id":1,  
"username":"string",  
"firstname":"string",  
"lastname":"string",  
"email":"string",  
"role":"string",  
"city":"string",  
"street":"string",  
"housenumber":0,  
"telephone":"string"  
}  
"}  

  
