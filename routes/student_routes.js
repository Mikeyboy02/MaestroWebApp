import {Router} from 'express'
import instructorData from "../data/instructors.js";
const router = Router()
import studentData from "../data/students.js"

router
    .route('/calendar')
    .get(async (req, res) => {

    })

router 
    .route('/booking')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        res.render("../views/studentScheduler", {title: "Scheduler", allowedTimes: currentUser["allowedTimes"], instructor:currentUser["firstName"].concat(" ", currentUser["lastName"])})
    })
    .post(async (req, res) => {
        let currentUser = req.session.user;
        let id = currentUser["_id"];
        let allowedTime = req.body.time;
        try{
            await instructorData.updateAppointmentsAndAllowTimes(id, undefined, allowedTime);
            await instructorData.removeAllowedTime(id, allowedTime);
            req.session.user = await instructorData.getInstructorById(id);
            return res.render("../views/studentScheduler", {title:"Scheduler", allowedTimes:req.session.user["allowedTimes"]});

        }catch(e){
            console.log(e);
        }    
    }) 

router
    .route('/dashboard/:id')
    .get(async (req, res) => {
        let id = req.params.id
        id = id.trim()
        let currentUser = req.session.user;
        //console.log(currentUser)
        res.render("../views/studentDashboard", {title: "Dashboard",
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    id: id})
    })

router
    .route('/parent/updatePassword')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        res.render("../views/updatePassword", {title: "Update parent password"})
    })
    .post(async (req, res) => {
        let currentUser = req.session.user
        let pass = req.body.newPasswordInput
        let confirmpass = req.body.confirmPasswordInput
        console.log(pass)
        let updated = await studentData.updateParentPassword(currentUser.parent.email, pass)
    
        req.session.user = updated
        return res.status(200).redirect("/students/dashboard")
    })

export default router