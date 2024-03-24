import {Router} from 'express'
import instructorData from "../data/instructors.js";
const router = Router()
import studentData from "../data/students.js"
import userData from "../data/users.js";

router
    .route('/calendar')
    .get(async (req, res) => {

    })

router 
    //routes student to book with instructor id in url
    .route('/booking/:id')
    .get(async (req, res) => {
        let id = "65f386be46e7afa8bb87c851";
        // let currentInstructor = await userData.getUserById(id);
        let currentInstructor = req.session.user
        let allowed = currentInstructor["allowedTimes"]
        console.log(allowed);
        let times = [];
        for(let i = 0; i<allowed.length; i++){
            times.push(allowed[i].time.concat(" ", allowed[i].date));
            console.log(times[i])
        }
        res.render("../views/studentScheduler", {title: "Scheduler", allowedTimes: times, instructor:currentInstructor["firstName"].concat(" ", currentInstructor["lastName"])})
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
    .route('/dashboard')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        //console.log(currentUser)
        res.render("../views/studentDashboard", {title: "Dashboard",
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName})
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