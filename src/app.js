const express = require("express");  // importing express which is a npm package to make http routes on server

const path = require("path");// importing package
const app = express();// initializing router
const hbs = require("hbs");// importing package

// connecting to the mongodb database
require("./db/conn");

const Register = require("./modles/registers.js");   // mongodb model 
const port = process.env.PORT || 3000;// creating variable to store port number if port is given in .env than that one will be used otherwise port 3000


console.log(path.join(__dirname, "../public"));
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// setting middlewares
app.use(express.json());  
 // setting urlencoded false
app.use(express.urlencoded({ extended: false }));   

// setting static path to serve files
app.use(express.static(static_path));  

// setting the view engine for server side rendering
app.set("view engine", "hbs");


app.set("views", template_path);
hbs.registerPartials(partials_path);

 // get / route which will render index.hbs file
app.get("/", (req, res) => {  

    res.render("index")
});

// get /register route renders register page
app.get("/register", (req, res) => {  
    res.render("register");
});
 // get /login route renders login page
app.get("/login", (req, res) => {  
    res.render("login");
});
app.post("/register", async (req, res) => {  
     // post route for registering user getting data from form
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
            const registered = await registerEmployee.save();
            res.status(201).render("index");
            //res.status(201).render("register");
        } else {
            res.send("passwords are not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
});



app.listen(port, () => {  // listening to the port
    console.log(`server is running at port no ${port}`);
})

