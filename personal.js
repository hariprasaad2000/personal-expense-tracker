const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const {Pool} = require('@neondatabase/serverless')
const { authMiddleware } = require("./Middleware")
const bcrypt = require("bcrypt")
const z = require("zod")

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



const SignupSchema = z.object({
    username : z.string().min(3),
    password : z.string().min(6)
})




//
app.post("/signup" , async function(req,res){

    const {data , success , error}= SignupSchema.safeParse(req.body);
    if (!success){
        res.status(403).json({
            message: "Incorrect input" , error: error.issues
        })
        return 
    }


    const username = data.username 
    const password = data.password 

    const hashedPassword = await bcrypt.hash(password , 10);

   
    const response = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1 , $2) RETURNING id" , 
        [username, hashedPassword]
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
        "SELECT * FROM users WHERE username =$1",
        [username] )
    
     const UserExist = response.rows[0];


        if (!UserExist){
            res.status(403).json({
                message: "user with this username and password doesn't exit"
            })
        } else {
            const correctPassword = await bcrypt.comapre(password , UserExist.password)

            if (correctPassword){
                const token = jwt.sign({userId : UserExist.id} , "hari123")
                res.json({token: token});
            } else {
                res.status(403).json({
                    message: "Incorrect credentials"
                })
            }
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
