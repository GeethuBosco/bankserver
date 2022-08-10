//server creation
//1.import express
const express = require('express')

//import jsonwebtoken
const jwt = require('jsonwebtoken')
//import dataservice
const dataService = require('./service/data.service')

//import cors
const cors=require('cors')

//2.create an app using express
const app = express()

//give command to share data via cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json from req body
app.use(express.json())
//4.resolving HTTP request

console.log('.............................................');

console.log('Bank Server');


//jwtmiddleware - to validate token
const jwtMiddleware = (req, res, next) => {
    try {
        console.log('Router specific  Middleware');
        const token = req.headers['x-access-token']
        //validate - verify
        const data = jwt.verify(token, 'supersecretkey12345')
        console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'please login'
        })
    }
}
//login
app.post('/login', (req, res) => {
    console.log(req.body);
    dataService.login(req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})
//register API -post
app.post('/register', (req, res) => {
    console.log(req.body);
    dataService.register(req.body.acno, req.body.username, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

//deposit
app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
//withdrawal
app.post('/withdrawal', (req, res) => {
    console.log(req.body);
    dataService.withdrawal(req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
    res.status(result.statusCode).json(result)
})
})
//transaction
app.post('/transaction', (req, res) => {
    console.log(req.body);
    dataService.getTransaction(req.body.acno)
    .then(result => {
    res.status(result.statusCode).json(result)
})
})

//delete

//3.create port number
app.listen(3000, () => {
    console.log('server started at port number : 3000');
})

