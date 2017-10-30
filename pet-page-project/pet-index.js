const express = require("express")
const app = express()
const bodyParser = require("body-parser")
var favouritePet = ""
var hasVisited = false;
//what does this next line do? I copied it from Jacques' slides.
app.use(bodyParser.urlencoded({
    extended: true
}))
//this next line was throwing an "Absolute path needed" error,
// then suddenly started working. I don't trust it. -bashu

app.get('/', (req, res) =>
 //if they haven't visited, show them the form. If they have, send them their favourite pet.
!hasVisited ? 
    res.sendFile("pet-index.html", {
        root: __dirname
    }) 
    : 
    res.send(`your favourite pet is a ${favouritePet}`));

app.post('/submitted', (req, res) => {
    favouritePet = req.body.pet;
    hasVisited = true;
    res.send(`you submitted a ${req.body.pet} as your favourite pet!`)
})
app.listen(3001)