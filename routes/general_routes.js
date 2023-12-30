import {Router} from 'express'
const router = Router()
import instructorData from "../data/instructors.js";

router.route('/').get(async (req, res) => {
  //homepage route will go here
});

router
    .route('/register')
    .get(async (req, res) => {
        //GET the register page
    })
    .post(async (req, res) => {

    })

router
    .route('/login')
    .get(async (req, res) => {
      //GET the login page
      res.render("../views/login", {title: "Login"})
    })
    .post(async (req, res) => {
      let email=req.body.emailInput;
      let pass = req.body.passInput;
      try{
        req.session.user = await instructorData.authenicateInstructor(email, pass);
        console.log("done");
        return res.status(200).redirect("/instructors/calendar");
      }catch(e){
        console.log(e);
      }
    })
router
    .route("./profile")
    .get(async (req, res) => {
        
    })

export default router