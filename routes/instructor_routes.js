import {Router} from 'express'
const router = Router()
import instructorData from "../data/instructors.js";

router
    .route('/calendar')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        res.render("./instructorCalendar", {title: "Calendar", appointments: currentUser["appointments"]});
    })
    .post(async (req, res) => {
        const currentUser = req.session.user;
        let id = currentUser["_id"];
        let appointments = req.body.apptInput;
        try{
            await instructorData.updateAppointmentsAndAllowTimes(id, currentUser["allowedTimes"], appointments);
            req.session.user = await instructorData.getInstructorById(id);
            return res.status(200).render("./instructorCalendar", {title: "Schedule", appointments: currentUser["appointments"]});
        }catch(e){
            console.log(e);
        }
    });

router
    .route('/schedule')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        res.render("./instructorScheduler", {title: "Schedule", lessons: currentUser["allowedTimes"]});
    })
    .post(async (req,res) => {
        const currentUser = req.session.user;
        let id = currentUser["_id"];
        let lessonType = {
            lessonDur: req.body.lessonDur,
            instrumentType: req.body.instrumentType,
            lessonLoc: req.body.lessonLoc
        };
        
        try{
            await instructorData.updateAppointmentsAndAllowTimes(id, lessonType, currentUser["appointments"]);
            //let tempUser = instructorData.getInstructorById(id);
            req.session.user.allowedTimes.push(lessonType);
            res.status(200).redirect("/instructors/schedule");
        }catch(e){
            console.log(e)
        }
    })

export default router