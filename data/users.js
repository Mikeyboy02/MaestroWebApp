import {ObjectId} from 'mongodb';
import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcryptjs';

import nodemailer from 'nodemailer';

import dotenv from 'dotenv'
dotenv.config({path: '.env'})
const credentials = {
    client_email: process.env.SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY
}

const exportedMethods = {

    async generatePassword() {
      var password = ""
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      var passLength = 12
      for (let i = 0; i < passLength; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    },

    async getUserById(userId) {
  
      const userCollection = await users();
      if(!ObjectId.isValid(userId)) throw `Does not exist`
      const searched = await userCollection.findOne({_id: new ObjectId(userId)});
      if(!searched) throw `No user with id ${userId} found.`;
      searched._id = searched._id.toString();
      return searched;
    },

    async createStudent( first, last, email, mobile, password, role, parent) {
      password = await bcrypt.hash(password, 12);
      let newUser

      newUser = {
        firstName: first,
        lastName: last,
        email: email,
        phoneNumber: mobile,
        password: password,
        role: role,
        parent: parent,
        appointments: []
      }

      let otpassword = await this.generatePassword()
      newUser.parent.password = await bcrypt.hash(otpassword, 12)
      newUser.parent.loggedIn = false 

      const userCollection = await users();
      const insertInfo = await userCollection.insertOne(newUser);
      if(!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not create new user. Try again.';
      }
      const newId = insertInfo.insertedId.toString();
      const user = await this.getUserById(newId);


      /*loggedIn starts as false
      when a parent logs in for the first time, bring to a change password page
      then change loggedIn to true
      */
      
      const mailOptions = {
        from: credentials.client_email,
        to: parent.email,
        subject: 'TEST OTP',
        text: 'Here is your one-time password to signin: ' + otpassword,
      }
      const mailTransport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: credentials.client_email,
          pass: credentials.private_key
  }
      })

      mailTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.error('Failed to send mail:', err)
        }
        console.log('Message sent: %s', info.messageId)
    })

      return user;
    },

    async createInstructor( first, last, email, mobile, password, role) {
//insert helpers for all parameters

    //encrypt password
    password = await bcrypt.hash(password, 12);
    const newInstructor = {
      firstName: first,
      lastName: last,
      email: email,
      phoneNumber: mobile,
      password: password,
      role: role, 
      allowedTimes : [],
      appointments : []
    }
    const instructorCollection = await users();
    const insertInfo = await instructorCollection.insertOne(newInstructor);
    if(!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'Could not create new user. Try again.';
    }
    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);
    return user;
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
          parent: {},
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
      if (!searched) 
          throw `No user with email ${email}`;
      return searched;
    },

    async getUserByParentEmail(email){
      const userCollection = await users();
      const searched = await userCollection.find({'parent.email': email})
      if (!searched) 
          throw `No parent with email ${email}`;
      return searched;
    },
    //authenitcate user for login
    async authenicateUser(email, password){
      const userCollection = await users();
      const user = await userCollection.findOne({email: email});
      const parent = await userCollection.findOne({'parent.email': email})
      try {
        if (!user && !parent)
            throw "No user with that email"
        if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if(!passwordMatch){
            throw `The email and password you have put in do not match`;
          } else {
            return {accessor: user.role, user: user};
          }
        }
        else if (parent) {
          const passwordMatch = await bcrypt.compare(password, parent.parent.password);
          if(!passwordMatch) {
            throw `The email and password you have put in do not match`;
          } else {
            return {accessor: "parent", user: parent};
          }
        }
      } catch (e) {console.log(e)}
      
    }
  
  
  };
  
  export default exportedMethods;