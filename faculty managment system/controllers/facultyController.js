
import mysql2 from 'mysql2';

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Harsha2004',
    database: 'facultyDataBase'
  });

db.connect((error)=>{
    if(error){
      console.log("Unable to connect Data base");
    }else{
      console.log("Data base connected");
    }
});

let is_login = false;

const getHomePage = (req,res)=>{
    res.render("index", {is_login});
}

const getFacultyManagementPage = (req,res)=>{
    db.query('SELECT * FROM Faculty', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.render("facultyManagement", {details: results, is_login});
        }
    });
}

const getEditFacultyPage = (req, res) => {
    let id = req.params.id.replace(':', '');
    console.log(id);
    db.query("SELECT * FROM Faculty WHERE faculty_id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else if (results.length === 0) {
            res.status(404).send('Faculty not found');
        } else {
            const faculty = results[0];
            faculty.hire_date = faculty.hire_date.toISOString().split("T")[0];
            faculty.date_of_birth = faculty.date_of_birth.toISOString().split("T")[0];
            res.render("editFacultyPage", { details: results[0], is_login});
        }
    });
};

const updateFacultyDetails = (req,res)=>{
    console.log(req.body);
    const {faculty_id, first_name, last_name, email, phone_number, address, date_of_birth, hire_date, department_id, position, salary} = req.body;
    if (!first_name || !last_name || !email || !phone_number || !address || !date_of_birth || !hire_date || !department_id || !position || !salary) {
        return res.status(400).send('All fields are required');
    }

    const query = "UPDATE Faculty SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?, date_of_birth = ?, hire_date = ?, department_id = ?, position = ?, salary = ? WHERE faculty_id = ?";
    const values = [first_name, last_name, email, phone_number, address, date_of_birth, hire_date, department_id, position, salary, faculty_id];

    db.query(query, values, (err,results)=>{
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }else{
            res.render("SuccessPage", {updatePage: true, is_login});
        }          
    });
}

const getCreateDetailsForm = (req,res)=>{
    res.render("updateDetailsPage", {is_login});
}

const addFaculty = (req,res)=>{
    console.log(req.body);
    const {first_name, last_name, email, phone_number, address, date_of_birth, hire_date, department_id, position, salary} = req.body;
    if (!first_name || !last_name || !email || !phone_number || !address || !date_of_birth || !hire_date || !department_id || !position || !salary) {
        return res.status(400).send('All fields are required');
    }

    const query = "INSERT INTO Faculty (first_name, last_name, email, phone_number, address, date_of_birth, hire_date, department_id, position, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const values = [first_name, last_name, email, phone_number, address, date_of_birth, hire_date, department_id, position, salary];

    db.query(query, values, (err, results)=>{
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }else{
            res.render("SuccessPage", {page: "addUserPage", is_login});
        }
    });
}



const getConfirmationPage = (req,res)=>{
    let id = req.params.id.replace(':', '');

    const query = "SELECT * FROM Faculty WHERE faculty_id = ?;";
    const values = [id];

    db.query(query, values, (err, results)=>{
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }else{
            res.render("confirmPage", {details: results[0], is_login});
        }
    });
}


const postConfirmationPage = (req,res)=>{
    let id = req.params.id.replace(':', '');
    console.log(id);

    const query = "DELETE FROM Faculty WHERE Faculty_id = ?;";
    const values = [id];

    db.query(query, values, (err, results)=>{
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }else{
            res.render("SuccessPage", {deletePage: true, is_login});
        }
    });

}

const getAddAttendancePage = (req,res)=>{

    const query = "SELECT faculty_id, first_name, last_name FROM Faculty";
    
    db.query(query, (err,results)=>{
        if(err){
            console.error("Error executing query: ",err);
            return res.status(500).send("Internal server error");
        }else{
            res.render("addAttendance", {details: results, is_login});
        }
    });
}

const postAddAttendance = (req,res)=>{
    console.log(req.body);
    const {faculty_id, attendance_date, status} = req.body;

    const query = "INSERT INTO Attendance SET faculty_id = ?, date = ?, status = ?";
    const values = [faculty_id, attendance_date, status];

    db.query(query, values, (err,results)=>{
        if(err){
            console.log("Error executing query: ", err);
            return res.status(500).send("Internal server error");
        }else{
            res.render("successPageAttendance", is_login);
        }
    });
}

const getAttendancePage = (req,res)=>{

    const query = `
    SELECT 
        a.attendance_id,
        a.faculty_id,
        f.first_name,
        f.last_name,
        a.date,
        a.status
    FROM 
        Attendance a
    JOIN 
        Faculty f 
    ON 
        a.faculty_id = f.faculty_id
    ORDER BY 
        a.date DESC, a.attendance_id;
    `;
    db.query(query, (err, results)=>{
        if(err){
            console.error("Error executing query: ", err);
            return res.status(500).send("Internal server error");
        }else{
            res.render("viewAttendance", {details: results, is_login});
        }
    });
}


const getReportPage = (req,res)=>{
    res.render("reportPage", {is_login});
}

const postReportPage = (req, res) => {
    const { start_date, end_date, report_type, faculty_id } = req.body;
    
    let query;
    const params = [start_date, end_date];
    
    if (report_type === 'attendance') {
        query = faculty_id
            ? 'SELECT * FROM Attendance WHERE date BETWEEN ? AND ? AND faculty_id = ?'
            : 'SELECT * FROM Attendance WHERE date BETWEEN ? AND ?';
        if (faculty_id) params.push(faculty_id);
    } else if (report_type === 'salary') {
        query = faculty_id
            ? 'SELECT faculty_id, salary, hire_date FROM Faculty WHERE hire_date BETWEEN ? AND ? AND faculty_id = ?'
            : 'SELECT faculty_id, salary, hire_date FROM Faculty WHERE hire_date BETWEEN ? AND ?';
        if (faculty_id) params.push(faculty_id);
    } else {
        res.status(400).send('Invalid report type');
        return;
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error generating report:', err);
            res.status(500).send('Error generating report');
        } else {
            const isAttendance = report_type === 'attendance';
            res.render('reportResults', { isAttendance, results});
        }
    });
};


const getAboutUsPage = (req,res)=>{
    res.render("aboutUs", {is_login});
}

const getContactUsPage = (req,res)=>{
    res.render("contactUs", {is_login});
}

const getLoginPage = (req, res)=>{
    res.render("loginPage");
}

const logout = (req,res)=>{
    is_login = false;
    res.render("index", is_login);
}

const postLoginPage = (req, res) => {
    const { username, password, role } = req.body;

    const query = "SELECT username, role FROM Users WHERE username = ? AND password = ? AND role = ?";
    const values = [username, password, role];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send("Internal server error");
        }

        if (results.length === 0) {
            res.render("loginPage", {error: true});
        }else{
            is_login = true;
            res.render("index", {is_login});
        }
    });
};
    
const getSignupPage = (req,res)=>{
    res.render("signupPage", {is_login});
}

export {getHomePage, getFacultyManagementPage, getEditFacultyPage, updateFacultyDetails, getCreateDetailsForm, addFaculty,
     getConfirmationPage, postConfirmationPage, getAddAttendancePage, getAttendancePage, postAddAttendance, getReportPage, postReportPage, getAboutUsPage,
    getContactUsPage, getLoginPage, postLoginPage, logout, getSignupPage}