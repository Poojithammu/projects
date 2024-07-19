import express from 'express';
import mysql2 from 'mysql2';

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Harsha2004',
    database: 'FeedBack'
  });

let is_login;
let is_admin;

db.connect((error)=>{
    if(error){
      console.log("Unable to connect Data base");
    }else{
      console.log("Data base connected");
    }
});

const createUser = (req, res) => {
    console.log(req.body);
    const { name, roll_number, password, email, department } = req.body;
  
    if (!email || !roll_number|| !password ||  !department || !name) {
      return res.status(400).send('All fields are required');
    }
  
    const query = 'INSERT INTO users (name, roll_number, password, email, department) VALUES ( ?, ?, ?, ?, ?)';
    const values = [name, roll_number, password, email, department];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.render('index', {is_login : true});
    });
  };

const getSignupPage = (req,res)=>{
    res.render("signup");
}

const getLoginPage = (req,res)=>{
    res.render("login");
}

const checkUser = (req,res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.render("login", {message : "Username and Password are required"});
    }

    const query = "SELECT * FROM users WHERE name = ? AND password = ?;";
    db.query(query, [username, password], (err, result)=>{
        if(err){
            res.send(err);
        }else{
            console.log('Query results:', result);
        }

        if(result && result.length > 0){
            console.log("login successfull");
            res.render("index", {is_login : true});
        }else{
            res.render("login", {message : "Incorrect Username or Password"});
        }
    })
}

const getFeedbackForm = (req,res)=>{
    res.render("feedBackForm");
}

const createFeedbackRecord = (req,res)=>{
    console.log(req.body);
    const {name, phone, rollNo, email, subject, branch, section, feedback} = req.body;
    if(!name || !phone || !rollNo || !email || !subject || !branch || !section || !feedback){
        return res.render("feedBackForm", {message: "All fields are required"});
    }

    const query = "INSERT INTO feedBackDetails  (name, phoneNo, rollNo, email, subject, branch, section, feedback) VALUES(?, ?, ?, ?, ?, ? ,?, ?);"
    db.query(query, [name, phone, rollNo, email, subject, branch, section, feedback], (err, results)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }else{
            console.log("query succesfull");
            res.render("success");
        }
    })
}

const getHomePage = (req,res)=>{
    res.render("index", {msg : false});
}

const getFeedBackDetails = async (req, res) => {
    db.query('SELECT * FROM feedBackDetails', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            if(is_admin == true){
                res.render("feedback_details", {feedbacks: results, admin : true});
            }else{
                res.render('feedback_details', { feedbacks: results, admin : false });
            }
        }
    });

};

const logout = (req,res)=>{
    if(is_admin==true){
        is_admin = false;
    }
    res.render("index", {is_login : false});
};

const getSuccesPage = (req,res)=>{
    res.render("success");
}

const postSuccessPage = (req,res)=>{
    res.render("index", {is_login : true});
}

const getAboutPage = (req,res)=>{
    res.render("aboutus");
}

const getContactPage = (req,res)=>{
    res.render("contactus");
}

const getAdminLogin = (req,res)=>{
    res.render("adminLogin");
};

const postAdminLogin = (req,res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.render("login", {message : "Username and Password are required"});
    }

    const query = "SELECT * FROM admin WHERE username = ? AND password = ?;";
    db.query(query, [username, password], (err, result)=>{
        if(err){
            console.error('Error executing query:', err);
        }else{
            console.log('Query results:', result);
        }

        if(result && result.length > 0){
            console.log("login successfull");
            is_admin = true;
            res.render("index", {is_login : true});
        }else{
            res.render("login", {message : "Incorrect Username or Password"});
        }
    })
};

const getForgotPassword = (req,res)=>{
    res.render("forgotPassword");
}
const getPasswordPage = (req,res)=>{
    res.render("password");
}

export {createUser, getSignupPage, getLoginPage, checkUser, getFeedbackForm, 
    createFeedbackRecord, getHomePage, getFeedBackDetails, logout, getSuccesPage, 
    postSuccessPage, getAboutPage, getContactPage, getAdminLogin, postAdminLogin, 
    getForgotPassword, getPasswordPage};
