import { closeConnection, dbConnection } from '../config/mongoConnections.js';
import userData from "../data/users.js";

(async () => {
  try {
    const db = await dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }
  try{
    await userData.createInstructor("Michael", "Bearint", "mbearint@stevens.edu","6096823797" ,"pass123", "instructor");
    await userData.createStudent("Josh", "Prasad", "jprasad2@stevens.edu","6034935270" ,"password123", "student", {email: "legojkp10@gmail.com", number: "6034935270"});
  }catch(e){
    console.log(e)
  }
  try
  {await closeConnection();}
  catch(e){
    console.log(e)
  }
})();
