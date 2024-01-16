import {Router} from 'express'
import instructorData from "../data/instructors.js";
const router = Router()

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

export default router