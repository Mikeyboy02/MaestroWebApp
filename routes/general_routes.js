import {Router} from 'express'
const router = Router()
import instructorData from "../data/instructors.js";
import userData from "../data/users.js"

router.route('/').get(async (req, res) => {
  //homepage route will go here
});

router
    .route('/register')
    .get(async (req, res) => {
        //GET the register page
        res.render("../views/signup", {title: "Signup"})
    })
    .post(async (req, res) => {
      try {
        let firstName = req.body.firstNameInput
        let lastName = req.body.lastNameInput
        let email = req.body.emailAddressInput
        let mobile = req.body.mobileNumberInput
        let password = req.body.passwordInput
        let role = "student"
        let parent = {email: req.body.parentEmailInput, number: req.body.parentNumberInput, password:""}

        let newUser = await userData.createStudent(
          firstName,
          lastName,
          email,
          mobile,
          password,
          role,
          parent
        )
        //console.log(newUser)
        return res.status(200).redirect("/login")
      } catch (e) {
        console.log(e)
        res.status(400).render("../views/signup", {title: "Signup", error: e})
      }
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
        req.session.user = await userData.authenicateUser(email, pass);
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