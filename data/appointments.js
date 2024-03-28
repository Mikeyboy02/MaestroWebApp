import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';

const exportedMethods = {

 async createAppointment(studentId,instructorId, type, date, time, cost) {
  const newAppt = {
    studentId:studentId,
    instructorId: instructorId,
    type:type,
    date: date,
    time:time,
    cost:cost
  };
  return newAppt;
 },
 async createApptType(instructorId, instructorName, cost, instrument, duration){
  const newAppt = {
    instructorId: instructorId,
    instructorName: instructorName,
    cost:cost,
    duration: duration,
    instrument: instrument
  };
  return newAppt;
 }



};

export default exportedMethods;