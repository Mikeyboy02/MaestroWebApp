import { closeConnection, dbConnection } from '../config/mongoConnections.js';
import instructorData from "../data/instructors.js";

(async () => {
  try {
    const db = await dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }
  try{
    await instructorData.createInstructor("Michael", "Bearint", "mbearint@stevens.edu","6096823797" ,"pass123");
  }catch(e){
    console.log(e)
  }
  try
  {await closeConnection();}
  catch(e){
    console.log(e)
  }
})();
