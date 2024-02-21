import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';
import userData from 'users.js';

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
 },
 async createApptType(instructorId, instructorName, date, time, instrument, duration){
  const newAppt = {
    instructorId: instructorId,
    instructorName: instructorName,
    date: date,
    time: time,
    duration: duration,
    instrument: instrument
  };
  return newAppt;
 }



};

export default exportedMethods;