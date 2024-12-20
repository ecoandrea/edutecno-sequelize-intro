import { dbConfig } from "../config/db.config.js"

import { initModels } from "../utils/db/initModels.js";
import { setupAssociation } from "../utils/db/setupAssociations.js";


export const dbConnect = async() => {
    try {
        await dbConfig.authenticate();// esta linea hace la coneccion
        initModels(dbConfig)
        setupAssociation
        await dbConfig.sync({ alter:true }) //modifica las tablas en base a como esta construida

        console.log('Logramos conectarnos a Postgre a traves de Sequelize 😱')
    } catch (error) {
        console.error('No pudimos conectarnos a la DB 👻', error);
        process.exit(1)
    }
}

//coneccion a db 
//authenticate() es de sequelize
//process.exit(1) para no quedar pegado y salir de base de datos
//1ero va el inicializador initModels y despues la asociaciones, osea se crea primero tablas , despues las relaciones