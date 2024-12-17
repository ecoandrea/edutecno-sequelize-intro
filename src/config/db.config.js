import { Sequelize } from "sequelize";
import dotenv from 'dotenv'; //variables de entorno

dotenv.config() //para que funcionen

export const dbConfig = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
})

//dbConfig es igual a nueva instancia se Sequelize que recibe varios argumento
//nombre de db , user, y el password de postgress, y como objeto va el host, puerto y el dialecto