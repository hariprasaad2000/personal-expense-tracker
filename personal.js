const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const {Pool} = require('@neondatabase/serverless')
const { authMiddleware } = require("./Middleware")

 const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_ArOT2voLB6wK@ep-frosty-dawn-b55widqs-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
 })


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
app.post("/signup" , async function(req,res){
    const username = req.body.username 
    const password = req.body.password 

   
    const response = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1 , $2) RETURNING id" , 
        [username, password]
    )


    res.json({
        message : "user signed up successfully", 
        id : response.rows[0].id
    })




})


app.post("/signin",  async function(req,res){

    const username = req.body.username 
    const password  = req.body.password



    const response = await pool.query(
        "SELECT * FROM users WHERE username =$1 AND password = $2",
        [username, password] )
    
     const UserExist = response.rows[0];

      if (!UserExist){
        res.status(403).json({
            message : "invalid login credentials "
        })
        return 
      } else {
        const token = jwt.sign({
            userId : UserExist.id     //This is now called as token creation 
        },"hari123" )

        res.json({token: token})


      }

    



})


app.post("/expense" , authMiddleware , async  function(req,res){
       //authenticated endpoint
       const userId = req.userId

    const items = req.body.items 
    const amount = parseInt(req.body.amount) 


    const response = await pool.query(
        "INSERT INTO expenses (userid, items , amount) VALUES ($1, $2, $3) RETURNING id ",
        [userId , items , amount ]
    )


 res.json({
    message: "successfully sent",
    id : response.rows[0].id
 })

    
})



app.get("/expense" , authMiddleware, async  function(req,res){

    const userId = req.userId


const Usertotals = await pool.query(
    "SELECT * FROM expenses WHERE userid = $1 ",
    [userId]

)

let total = 0;

for (let i = 0; i < Usertotals.rows.length; i++) {
    total += Usertotals.rows[i].amount;
}



res.json({
    expenses : Usertotals.rows,
    total: total
})

})











const PORT = process.env.PORT || 3001;
app.listen(PORT);
