import dotenv, {config} from 'dotenv';
dotenv.config()

export const mongoConfig = {
  serverUrl: 'mongodb://127.0.0.1:27017/',
  database: 'maestro_web_app'
};

