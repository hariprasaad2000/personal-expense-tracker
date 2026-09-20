const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

//middleware
app.use(express.json())


app.get("/" , function(req,res){
    res.sendFile(__dirname + "/personal.html")
})
app.get("/signup" , function(req,res){
    res.sendFile(__dirname + "/signup1.html")
})
app.get("/signin" , function(req,res){
    res.sendFile(__dirname + "/signin1.html")
})



const Users = []
const Expenses  = []


//
app.post("/signup" , function(req,res){
    const username = req.body.username 
    const password = req.body.password 

    const  UserExist = Users.find(user=> user.username === username)
    if (UserExist){
        res.status(403).json({
            message : "Username already Exist"
        })
        return 
    }

    Users.push({
        username : username , 
        password: password })


    res.json({
        message : "Sucessfully stored"
    })




})


app.post("/signin", function(req,res){

    const username = req.body.username 
    const password  = req.body.password
    
    const UserExists = Users.find(user=>user.username === username && user.password=== password)
    if (!UserExists){
        res.status(403).json({
            message: "Username and password doesn't Exist"
        })
        return 
    }



    const token = jwt.sign({
        username : username     //This is now called as token creation 
    },"hari123" )


    res.json({
        token : token 
    })






})


app.post("/expense" , function(req,res){
       //authenticated endpoint

    const token = req.headers.token 

    if (!token ){
        res.status(403).send({
            message : "Invalid token"
        })
        return 
    }


    const decoded = jwt.verify(token , "hari123")      //usually now we have something decoded = [{username : hariprasaad }]
    const username  = decoded.username  

   if (!username){
    res.status(403).json({
        message : "Username invalid"
    })
    return 
   }



    const items = req.body.items 
    const amount = parseInt(req.body.amount) 

 Expenses.push({
    username: username,
    item :  items,
    amount : amount
 })


 res.json({
    message: "successfully sent"
 })

    
})



app.get("/expense" , function(req,res){

    const token = req.headers.token 

    if (!token ){
        res.status(403).send({
            message : "Invalid token"
        })
        return 
    }


    const decoded = jwt.verify(token , "hari123")      //usually now we have something decoded = [{username : hariprasaad }]
    const username  = decoded.username  

   if (!username){
    res.status(403).json({
        message : "Username invalid"
    })
    return 
   }


    const Usertotal = Expenses.filter(expense =>expense.username ===username  );
   

    let total = 0;

for (let i = 0; i < Usertotal.length; i++) {
    total += Usertotal[i].amount;
}
res.json({
    total: total
})

})











const PORT = process.env.PORT || 3001;
app.listen(PORT);
