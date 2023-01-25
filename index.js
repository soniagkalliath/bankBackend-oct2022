//Import express inside index.js
const express = require('express')

// Import cors in index.js
const cors = require('cors')

//Import dataservice
const dataService = require('./services/dataService')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//create server app using express
const server = express()

//use cors to define origin
server.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
server.use(express.json())

//set up port for server app
server.listen(3000,()=>{
    console.log('Server started at 3000');
})

//application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log('Inside application specific middleware');
    next()
}

server.use(appMiddleware)
//bankapp front end request resolving

//token verify middleware
const jwtMiddleware =(req,res,next)=>{
    console.log('Inside router specific middleware');
    //get token from req headers
    const token = req.headers['access-token']
    console.log(token);
    try{
        //verify token
    const data=jwt.verify(token,'supersecretkey123')
    console.log(data);
    req.fromAcno = data.currentAcno
    console.log('Valid Token');
    next()
    }
    catch{
        console.log('Invalid token');
        res.status(401).json({
            message:'Please Login!!'
        })
    }

}

//register api call resolving
server.post('/register',(req,res)=>{
console.log('Inside register Api');
console.log(req.body);
//asynchronus
dataService.register(req.body.uname,req.body.acno,req.body.pswd)
.then((result)=>{
    res.status(result.statusCode).json(result)
})
})

//login api call resolving
server.post('/login',(req,res)=>{
    console.log('Inside login Api');
    console.log(req.body);
    //asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })

//getBalance api
server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside getBalance Api');
    console.log(req.params.acno);
    //asynchronus
    dataService.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })
//deposit api
server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('Inside deposit Api');
    console.log(req.body);
    //asynchronus
    dataService.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })

//fundTransfer api
server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer Api');
    console.log(req.body);
    //asynchronus
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
       res.status(result.statusCode).json(result)
    })
    })

//getAllTransactions
server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('Inside getAllTransactions api');
    dataService.getAllTransactions(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//delete-account api
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside delete-account Api');
    console.log(req.params.acno);
    //asynchronus
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })