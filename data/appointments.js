import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';

const exportedMethods = {

 createAppointment(studentName, email, type, instructorName, Date, Time) {
  const newAppt = {
    student:studentName,
    email:email,
    type:type,
    instructor:instructorName, 
    date: Date,
    time:Time
  };
  return newAppt;
 }



};

export default exportedMethods;