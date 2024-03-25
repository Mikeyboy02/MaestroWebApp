//import routes for the different pages
import instructorRoutes from './instructor_routes.js'
import studentRoutes from './student_routes.js'
import adminRoutes from './admin_routes.js'
import generalRoutes from './general_routes.js'

//set up routes for different pages
const constructorMethod = (app) => {
    app.use('/', generalRoutes)
    app.use('/instructors', instructorRoutes)
    app.use('/students', studentRoutes)
    app.use('/admin', adminRoutes)
    app.use('*', (req, res) => {

    })
}

export default constructorMethod