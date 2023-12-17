import {ObjectId} from 'mongodb';
import { instructors } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';

const exportedMethods = {

  async getInstructorById(instructorId) {

    const instructorCollection = await instructors();
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
    const instructorCollection = await instructors();
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
    const instructorCollection = await instructors();
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
  async updateAppointmentsAndAllowTimes(Id, allowedTimes, appointments) {
    let updatedInstructor = {
      allowedTimes: allowedTimes,
      appointments: appointments
    };
    const user = await this.getInstructorById(Id);
    //check updated parameters, if they were updated

    //update user
    const instructorCollection = await instructors();
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
    const instructorCollection = await instructors();
    const deleteInfo = await instructorCollection.findOneAndDelete(
      {_id: new ObjectId(Id)}
    );
    if (deleteInfo.lastErrorObject.n == 0) throw `Could not delete instructor with id ${Id}`
  },

  async getInstructorByEmail(email){
    const instructorCollection = await instructors();
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