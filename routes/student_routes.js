import {Router} from 'express'
import instructorData from "../data/instructors.js";
const router = Router()
import studentData from "../data/students.js"
import userData from "../data/users.js";
import moment from 'moment';

router
    .route('/calendar')
    .get(async (req, res) => {

    })

//Helper for booking:
// function calculate(start, end){
//     let timeStops = [];
//     while(start)
// }

router 
    //routes student to book with instructor id in url
    .route('/booking/:id')
    .get(async (req, res) => {
        let id = req.params.id;
        let currentInstructor = await userData.getUserById(id);
        // let currentInstructor = req.session.user
        let allowed = currentInstructor["allowedTimes"]
        console.log(allowed);
        times = {
            'M': "12:00" 
        };
        console.log(currentInstructor.appointmentTypes);
        
        res.render("../views/studentScheduler", {title: "Scheduler",apptTypes:currentInstructor.appointmentTypes ,allowedTimes: times, instructor:currentInstructor["firstName"].concat(" ", currentInstructor["lastName"])})
    })
    .post(async (req, res) => {
        let currentStudent = req.session.user;
        let id = req.params.id;
        let currentInstructor = await userData.getUserById(id);
        console.log(currentStudent);
        console.log(currentInstructor);
        let studentId = currentUser["_id"];
        let allowedTime = req.body.time;
        try{
            await instructorData.addAppointmentToInstructor(id, studentId, null, null, 30);
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