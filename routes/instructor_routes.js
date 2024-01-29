import {Router} from 'express'
import express from 'express'
const router = Router();
const app = express();
import instructorData from "../data/instructors.js";
import { all } from 'axios';
// const app = require('express');
// const bodyParser = require('body-parser');

// Middleware
//router.use(bodyParser.json());
app.put('/process', async (req, res) => {
    console.log("process");
    const currentUser = req.session.user;
    let id = currentUser["_id"];
    let appointments = req.body.apptInput;
    let added_allowedTimes = req.body.allowedTimesInput;
    if (added_allowedTimes != null){
        for (add in added_allowedTimes){
            allowedTimes = allowedTimes.concat(add.innerHTML);
            console.log(add.innerHTML);
        }
    }
    try{
        await instructorData.updateAppointmentsAndAllowTimes(id, allowedTimes, appointments);
        req.session.user = await instructorData.getInstructorById(id);
        res.json({
            status: 'success',
            message: 'Data received successfully!'
        });
        return res.status(200).render("./instructorCalendar", {title: "Schedule", appointments: req.session.user["appointments"]});
    }catch(e){
        console.log(e);
    }
});
app.listen(3000, () => {
    console.log('Express server listening on port 3000');
});

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
        let allowedTimes = req.body.allowedTimesInput;
        try{
            await instructorData.updateAppointmentsAndAllowTimes(id, allowedTimes, appointments);
            req.session.user = await instructorData.getInstructorById(id);
            return res.status(200).render("./instructorCalendar", {title: "Schedule", appointments: req.session.user["appointments"]});
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