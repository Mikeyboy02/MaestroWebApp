import {Router} from 'express'
const router = Router()
import instructorData from "../data/instructors.js";

router
    .route('/schedule')
    .get(async (req, res) => {
        let currentUser = req.session.user;
        res.render("./instructorSchedule", {title: "Schedule"})
    })
    .post(async (req, res) => {
        const currentUser = req.session.user;
        let id = currentUser["_id"];
        let appointments = req.body.apptInput;
        try{
            await instructorData.updateAppointmentsAndAllowTimes(id, currentUser["allowedTimes"], appointments);
            req.session.user = await instructorData.getInstructorById(id);
            return res.status(200).render("./instructorSchedule", {title: "Schedule"});
        }catch(e){
            console.log(e);
        }
    });

router
    .route('/calendar')
    .get(async (req, res) => {
        
    })

export default router