import {Router} from 'express'
const router = Router()

router
    .route('/schedule')
    .get(async (req, res) => {
        res.render("./instructorSchedule", {title: "Schedule"})
    })
    .patch(async (req, res) => {

    })

router
    .route('/calendar')
    .get(async (req, res) => {
        
    })

export default router