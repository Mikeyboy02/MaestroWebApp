import {Router} from 'express'
const router = Router()

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
      res.render("./login", {title: "Login"})
    })
    .post(async (req, res) => {

    })
router
    .route("./profile")
    .get(async (req, res) => {
        
    })

export default router