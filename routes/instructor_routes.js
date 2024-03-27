import {Router} from 'express'
const router = Router()
import instructorData from "../data/instructors.js";
import userData from "../data/users.js";
import apptData from "../data/appointments.js";

router
    .route('/calendar/:id')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        res.render("./instructorCalendar", {title: "Calendar", appointments: currentUser["appointments"],  id: currentUser["_id"]});
    })
    .post(async (req, res) => {
        const currentUser = req.session.user;
        let id = currentUser["_id"];
        // let appointments = req.body.apptInput;
        let allowedTimes = req.body.allowedTimesInput;
        try{
            await instructorData.updateAppointmentsAndAllowTimes(id, allowedTimes, currentUser["appointments"]);
            req.session.user = await instructorData.getInstructorById(id);
            return res.status(200).render("./instructorCalendar", {title: "Schedule", appointments: req.session.user["appointments"], id: currentUser["_id"]});
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
        let name = currentUser["firstName"].concat(" ", currentUser["lastName"]);
        let date = req.body.lessonDate;
        let time = req.body.lessonTime;
        let duration = req.body.lessonDur;
        let instrument = req.body.instrumentType;
        //const newAppt = await apptData.createApptType(id,name,date,time, instructorData, duration);
        //console.log(name);
        try{
            await instructorData.addApptType(id,name,date,time, instrument, duration);
            //let tempUser = instructorData.getInstructorById(id);
            req.session.user = await userData.getUserById(id);
            //req.session.user.allowedTimes.push(lessonType);
            res.status(200).redirect("/instructors/schedule");
        }catch(e){
            console.log(e)
        }
    });

router
    .route('/profile/:id')
    .get(async (req, res) => {
        let id = req.params.id
        id = id.trim()
        let currentUser = req.session.user;
        res.render("./instructorProfile", {
            title: "Calendar", 
            lessons: currentUser["appointments"], 
            id: id,
            firstName: req.session.user.firstName,
            lastName: req.session.user.lastName});
    })
    // .post(async (req,res) => {
    //     const currentUser = req.session.user;
    //     let id = currentUser["_id"];
    //     let lessonType = {
    //         lessonDur: req.body.lessonDur,
    //         instrumentType: req.body.instrumentType,
    //         lessonLoc: req.body.lessonLoc
    //     };
        
    //     try{
    //         await instructorData.updateAppointmentsAndAllowTimes(id, lessonType, currentUser["appointments"]);
    //         //let tempUser = instructorData.getInstructorById(id);
    //         req.session.user.allowedTimes.push(lessonType);
    //         res.status(200).redirect("/instructors/profile");
    //     }catch(e){
    //         console.log(e)
    //     }
    // })

export default router