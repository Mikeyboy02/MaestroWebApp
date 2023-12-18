import {MongoClient} from 'mongodb';
import dotenv from 'dotenv'
dotenv.config({path: '.env'})
const uri = process.env.DB_URL

const settings = {
  "mongoConfig": {
    "serverUrl": uri,   
    "database": "SeniorDesign"
  }
}

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(settings.mongoConfig.serverUrl);
    _db = _connection.db(settings.mongoConfig.database);
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export {dbConnection, closeConnection};

