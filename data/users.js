import {ObjectId} from 'mongodb';
import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';

const exportedMethods = {

    async getUserById(userId) {
  
      const userCollection = await users();
      const searched = await userCollection.findOne({_id: new ObjectId(userId)});
      if(!searched) throw `No user with id ${userId} found.`;
      searched._id = searched._id.toString();
      return searched;
    },
  
    async createUser(firstName, lastName, email, mobile, password, role) {
      //insert helpers for all parameters
  
      //encrypt password
      password = await bcrypt.hash(password, 12);
      let newUser

      if (role == "student")
      {
        newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: mobile,
          password: password,
          role: role,
          appointments : []
        }
      }
      else if (role == "instructor")
      {
        newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: mobile,
          password: password,
          role: role,
          allowedTimes : [],
          appointments : []
        }
      }

      const userCollection = await users();
      const insertInfo = await userCollection.insertOne(newUser);
      if(!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not create new user. Try again.';
      }
      const newId = insertInfo.insertedId.toString();
      const user = await this.getUserById(newId);
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
      const userCollection = await users();
      const updateInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(Id)},
        {$set: updatedInstructor},
        {returnDocument: 'after'}
      );
      if (updateInfo.lastErrorObject.n === 0) {
        throw `Could not update user with id ${Id}.`;
      }
      return await this.getUserById(Id);
    },
  
    async deleteUser(Id){
      const userCollection = await users();
      const deleteInfo = await userCollection.findOneAndDelete(
        {_id: new ObjectId(Id)}
      );
      if (deleteInfo.lastErrorObject.n == 0) throw `Could not delete user with id ${Id}`
    },
  
    async getUserByEmail(email){
      const userCollection = await users();
      const searched = await userCollection.findOne({email: email});
      if (!searched) throw `No user with email ${email}`;
      return searched;
    },
    //authenitcate user for login
    async authenicateUser(email, password){
      const user = await this.getUserByEmail(email);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if(!passwordMatch){
        throw `The email and password you have put in do not match`;
      } else {
        return user;
      }
  
    }
  
  
  };
  
  export default exportedMethods;