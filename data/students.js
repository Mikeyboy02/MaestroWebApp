import {ObjectId} from 'mongodb';
import { users } from '../config/mongoCollections.js'
import bcrypt from 'bcryptjs';
import userData from './users.js'


const exportedMethods = {

    async updateParentPassword(email, password) {
        password = await bcrypt.hash(password, 12);
        const userCollection = await users();
        let updated = await userCollection.findOneAndUpdate(
        {'parent.email': email},
        {
            $set: {'parent.password': password, 'parent.loggedIn': true}
        },
        {
            returnDocument: "after"
        })
        if (!updated)
            throw 'Could not update password'
        return updated
    }

}

export default exportedMethods