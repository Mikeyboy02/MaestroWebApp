import {Router} from 'express'
//create new route
const router = Router()

//handling /schedule route
router
    .route('/schedule')
    .get(async (req, res) => {
        //get instructor schedule page
        res.render("./instructorSchedule", {title: "Schedule"})
    })
    .patch(async (req, res) => {

    })

router
    .route('/calendar')
    .get(async (req, res) => {
        
    })

export default router