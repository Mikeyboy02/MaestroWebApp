import {ObjectId} from 'mongodb';
import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';
import appointmentData from './appointments.js';

const exportedMethods = {

  async getInstructorById(instructorId) {

    const instructorCollection = await users();
    const searched = await instructorCollection.findOne({_id: new ObjectId(instructorId)});
    if(!searched) throw `No instructor with id ${instructorId} found.`;
    searched._id = searched._id.toString();
    return searched;
  },

  async createInstructor(firstName, lastName, email, mobile, password) {
    //insert helpers for all parameters

    //encrypt password
    password = await bcrypt.hash(password, 12);
    const newInstructor = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: mobile,
      password: password,
      allowedTimes : [],
      appointments : []
    }
    const instructorCollection = await users();
    const insertInfo = await instructorCollection.insertOne(newInstructor);
    if(!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'Could not create new user. Try again.';
    }
    const newId = insertInfo.insertedId.toString();
    const user = await this.getInstructorById(newId);
    return user;
  },

  async updateInstructor(Id, firstName, lastName, email, mobile, password) {
    let updatedInstructor = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile
    };
    const user = await this.getInstructorById(Id);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
      updatedInstructor.password = await bcrypt.hash(password, 12);
    }
    //check updated parameters, if they were updated

    //update user
    const instructorCollection = await users();
    const updateInfo = await instructorCollection.findOneAndUpdate(
      {_id: new ObjectId(Id)},
      {$set: updatedInstructor},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0) {
      throw `Could not update user with id ${Id}.`;
    }
    return await this.getInstructorById(Id);
  },

  async addAppointment(Id, studentName, email, type, instructorName, date, time){
    const user = await this.getInstructorById(Id);
    let newAppts = user.appointments;
    newAppts = user.appointments.concat(appointmentData.createAppointment(studentName, email, type, instructorName, date, time))
    let updatedInstructor = {
      appointments: newAppts
    };
    const instructorCollection = await users();
    const updateInfo = await instructorCollection.findOneAndUpdate(
      {_id: new ObjectId(Id)},
      {$set: updatedInstructor},
      {returnDocument: 'after'} 
    );
    return await this.getInstructorById(Id);
  },

  async addApptType(Id, name, date, time, instrument, duration){
    const user = await this.getInstructorById(Id);
    let newAppts = user.allowedTimes;
    newAppts = user.allowedTimes.concat(appointmentData.createApptType(Id, name, date, time, instrument, duration));
    let updatedInstructor = {
      appointments: newAppts
    };
    const instructorCollection = await users();
    const updateInfo = await instructorCollection.findOneAndUpdate(
      {_id: new ObjectId(Id)},
      {$set: updatedInstructor},
      {returnDocument: 'after'}
    );
    return await this.getInstructorById(Id);
  },

  async updateAppointmentsAndAllowTimes(Id, allowedTimes, appointments) {
    const user = await this.getInstructorById(Id);
    console.log(user);
    let newAppts = user.appointments;
    if(appointments !== undefined && appointments.length !== 0){
      newAppts = user.appointments.concat([appointments]);
    }
    //console.log(newAppts);
    let newAllowed = user.allowedTimes;
    if(allowedTimes !== undefined && allowedTimes.length !==0){
      newAllowed = user.allowedTimes.concat([allowedTimes]);
    }
    let updatedInstructor = {
      allowedTimes: newAllowed,
      appointments: newAppts
    };
    //check updated parameters, if they were updated

    //update user
    const instructorCollection = await users();
    const updateInfo = await instructorCollection.findOneAndUpdate(
      {_id: new ObjectId(Id)},
      {$set: updatedInstructor},
      {returnDocument: 'after'}
    );
    // if (updateInfo.lastErrorObject.n === 0) {
    //   throw `Could not update user with id ${Id}.`;
    // }
    return await this.getInstructorById(Id);
  },

  async removeAllowedTime(Id, allowedTime){
    const user = await this.getInstructorById(Id);
    let allowed = user.allowedTimes;
    if(allowed.includes(allowedTime)){
      const index = allowed.indexOf(allowedTime);
      let removed = allowed.splice(index, 1);
    }
    let updatedInstructor = {
      allowedTimes: allowed,
    };

    const instructorCollection = await users();
    const updateInfo = await instructorCollection.findOneAndUpdate(
      {_id: new ObjectId(Id)},
      {$set: updatedInstructor},
      {returnDocument: 'after'}
    );
    // if (updateInfo.lastErrorObject.n === 0) {
    //   throw `Could not update user with id ${Id}.`;
    // }
    return await this.getInstructorById(Id);

  },

  async deleteInstructor(Id){
    const instructorCollection = await users();
    const deleteInfo = await instructorCollection.findOneAndDelete(
      {_id: new ObjectId(Id)}
    );
    if (deleteInfo.lastErrorObject.n == 0) throw `Could not delete instructor with id ${Id}`
  },

  async getInstructorByEmail(email){
    const instructorCollection = await users();
    const searched = await instructorCollection.findOne({email: email});
    if (!searched) throw `No user with email ${email}`;
    return searched;
  },
  //authenitcate user for login
  async authenicateInstructor(email, password){
    const user = await this.getInstructorByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
      throw `The email and password you have put in do not match`;
    } else {
      return user;
    }

  }


};

export default exportedMethods;