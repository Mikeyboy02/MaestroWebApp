import {Router} from 'express'
//create router
const router = Router()
import instructorData from "../data/instructors.js";

router.route('/').get(async (req, res) => {
  //homepage route will go here
});

//handling /register route
router
    .route('/register')
    .get(async (req, res) => {
        //GET the register page
    })
    .post(async (req, res) => {

    })

//handling /login route
router
    .route('/login')
    .get(async (req, res) => {
      //GET the login page
      res.render("../views/login", {title: "Login"})
    })
    .post(async (req, res) => {
      //get email
      let email=req.body.emailInput;
      //get password
      let pass = req.body.passInput;
      try{
        //authenticate instructor with inputted email and password
        req.session.user = await instructorData.authenicateInstructor(email, pass);
        console.log("done");
        //redirect instructor's calendar when logged in successfully
        return res.status(200).redirect("/instructors/calendar");
      }catch(e){
        console.log(e);
      }
    })
//handling /profile route
router
    .route("./profile")
    .get(async (req, res) => {
        
    })

export default router