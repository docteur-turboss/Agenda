const formidable = require('./middlewares/formidable')
const projet = require('./routes/projet.routes')
const cookieParser = require('cookie-parser')
const user = require('./routes/user.routes')
const express = require('express')

require('dotenv').config({path : './config/.env'})

const app = express()

app.use(cookieParser())
app.use(formidable)

app.use("/api/v1/organisation", projet);
app.use("/api/v1/users", user);


app.get('*', (req, res) =>{
    res.send('ok')
})

app.listen(process.env.PORTEXPRESS, () =>{
    console.log(`The back-end node (express) is ready to port : ${process.env.PORTEXPRESS} (http:localhost:${process.env.PORTEXPRESS})`)
})