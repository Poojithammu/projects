import {Router} from 'express';
import { checkUser, createFeedbackRecord, createUser, getAboutPage, getAdminLogin, getContactPage,
    getFeedBackDetails, getFeedbackForm, getForgotPassword, getHomePage, getLoginPage, getPasswordPage, getSignupPage,
    getSuccesPage, logout, postAdminLogin, postSuccessPage } from '../controllers/studentController.js';

const router = Router();

router.get("/signup", getSignupPage);

router.post("/signup", createUser);

router.get("/login", getLoginPage);

router.post("/login", checkUser);

router.get("/feedback", getFeedbackForm);

router.post("/feedback", createFeedbackRecord);

router.get("/index", getHomePage);

router.get("/feedback-details", getFeedBackDetails);

router.get("/logout", logout);

router.post("/success", postSuccessPage);

router.get("/success", getSuccesPage);

router.get("/aboutus", getAboutPage);

router.get("/contactus", getContactPage);

router.get("/adminLogin", getAdminLogin);

router.post("/adminLogin", postAdminLogin);

router.get("/forgot-password", getForgotPassword);

router.get("/password-page",getPasswordPage);

export {router};