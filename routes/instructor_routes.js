import {Router} from 'express'
const router = Router()
import instructorData from "../data/instructors.js";

//handling /calendar route
router
    .route('/calendar')
    .get(async (req, res) => {
        //get current user
        let currentUser = req.session.user;
        res.render("./instructorCalendar", {title: "Calendar", appointments: currentUser["appointments"]});
    })
    .post(async (req, res) => {
        //get current user
        const currentUser = req.session.user;
        //get user id
        let id = currentUser["_id"];
        //get appointment data from body
        let appointments = req.body.apptInput;
        try{
            //update appointments and allowed times for instructor
            await instructorData.updateAppointmentsAndAllowTimes(id, currentUser["allowedTimes"], appointments);
            //update with latest data
            req.session.user = await instructorData.getInstructorById(id);
            return res.status(200).render("./instructorCalendar", {title: "Schedule", appointments: currentUser["appointments"]});
        }catch(e){
            console.log(e);
        }
    });

//handling /schedule route
router
    .route('/schedule')
    .get(async (req, res) => {
        //get current user
        let currentUser = req.session.user;
        // Get instructor scheduler page and pass title and lessons data
        res.render("./instructorScheduler", {title: "Schedule", lessons: currentUser["allowedTimes"]});
    })
    .post(async (req,res) => {
        //get current user
        const currentUser = req.session.user;
        //get user id
        let id = currentUser["_id"];
        //create lessonType object 
        let lessonType = {
            lessonDur: req.body.lessonDur,
            instrumentType: req.body.instrumentType,
            lessonLoc: req.body.lessonLoc
        };
        
        try{
            //update appointments and allowed times for instructor
            await instructorData.updateAppointmentsAndAllowTimes(id, lessonType, currentUser["appointments"]);
            //let tempUser = instructorData.getInstructorById(id);
            req.session.user.allowedTimes.push(lessonType);
            res.status(200).redirect("/instructors/schedule");
        }catch(e){
            console.log(e)
        }
    })

export default router