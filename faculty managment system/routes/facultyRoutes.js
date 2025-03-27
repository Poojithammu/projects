import { Router } from "express";
import { getHomePage, getFacultyManagementPage, getEditFacultyPage, updateFacultyDetails, getCreateDetailsForm,
    addFaculty, getConfirmationPage, postConfirmationPage, getAddAttendancePage, getAttendancePage, postAddAttendance,
    getReportPage, postReportPage, getAboutUsPage, getContactUsPage, getLoginPage, logout , getSignupPage ,
    postLoginPage} from "../controllers/facultyController.js";


const router = Router();


router.get("/", getHomePage);
router.get("/home", getHomePage);
router.get("/facultyManagement", getFacultyManagementPage);
router.get("/facultyManagement/:id", getEditFacultyPage);
router.post("/facultyManagement", updateFacultyDetails);
router.get("/addFaculty", getCreateDetailsForm);
router.post("/addFaculty", addFaculty);
router.get("/delete/:id", getConfirmationPage);
router.post("/delete/:id", postConfirmationPage);
router.get("/addAttendance", getAddAttendancePage);
router.post("/addAttendance", postAddAttendance);
router.get("/viewAttendance", getAttendancePage);
router.get("/reports", getReportPage);
router.post("/reports", postReportPage);
router.get("/aboutUS", getAboutUsPage);
router.get("/contactUs", getContactUsPage);
router.get("/login", getLoginPage);
router.post("/login", postLoginPage);
router.get("/logout", logout);  
router.get("/signup", getSignupPage);
export {router}