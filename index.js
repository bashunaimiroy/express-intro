const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const fs = require("fs")
const bcrypt = require("bcrypt")
let loginInfo = {}
app.use(express.static('./'));
app.use(bodyParser.urlencoded({
    extended: true
}))

//hoo boy. Asynchronously reads the logins.txt file and returns a string. 
//then as a callback function, sets the loginInfo object 
//to the value of the string, parsed into an object.
fs.readFile("logins.txt", (err, logins) => {
    loginInfo = JSON.parse(logins)
})



app.get('/', (req, res) => res.sendFile("index.html", {
    root: __dirname
}))

app.get('/signup', (req, res) => res.sendFile("signup.html", {
    root: __dirname
}))

app.post('/create-account', (req, res) => {
    //responds to a post by hashing the input password with 10 salts, and adding the username and hash
    //as a key-value pair to the loginInfo object.
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        loginInfo[req.body.username] = hash;
        fs.writeFile("./logins.txt", JSON.stringify(loginInfo));
    })
    //rewrites the logins.txt with the JSON.stringified loginInfo object.

    //sends the user a nice html page to let them know they did good
    res.sendFile("account-created.html", {
        root: __dirname
    })
})

app.post('/login', (req, res) => {
    bcrypt.compare(req.body.password, loginInfo[req.body.username], (err, result) => {
        if (err) {
            res.send("Sorry, didn't find that username.")
        }
        result ? res.sendFile("success.html", {
                root: __dirname
            }) :
            res.sendFile("error.html", {
                root:__dirname
            })
    })
})

app.listen(3000)