import { Op } from "sequelize"
import { ValidationError } from "../../errors/typeErrors.js"

export const isArrayValidate = (data) => {
    if (!Array.isArray(data))
      throw new ValidationError(
        "La data ingresada no es un arreglo"
      );
}


export const isEmptyData = (data) => {
    if(!data || data.length === 0) {
        throw new ValidationError("la data ingresada esta vacía")
    }  
}

export const isEmptyResponseData = (data) => {
    if (!data || data.length === 0) {
      throw new NotFoundError("la data solicitada no fue encontrada");
    }  
}
/**
 * Valida que el regsitro que se esta evaluando no exista previamente para un campo dado que se espera que sea único. En caso de existir un valor dúplicado en un campo único, arrojara un error de validación
 * @param {Model} Modelo - Modelo constructor de los datos que se comúnica con la DB
 * @param {object} data - Datos a evaluar en la petición hacia la DB 
 * @param {string} field - Campo que se desea evaluar en la clausula Where
 * @param {string} excluidID - ID en formato UUID que será excluida de esta validación. Por defecto es null 
 * @throws {ValidationError} - Si el valor existe arrojara un error de validación 
 */
export const validateExistData = async(Modelo, data, fields, excluidID = null ) => {

    const duplicatedFields = []

    isArrayValidate(fields)

    for(const field of fields) { //recorre los campos de loscampos
        if(data[field]) { //si existe
            const whereClause = { [field]: data[field] }

            //Esto verifica si se debe excluir el registro que se esta evaluando (útil para los update)
            if(excluidID) {
                whereClause.id = { [Op.ne]: excluidID} //Op.ne => Operador (Sequelize) Not Equal(ne)
            }

            //whereClause.id le agrego campo id = operador de sequelize que excluye al ID para que no este en la busqueda

            const existData = await Modelo.findOne({ where: whereClause})
            if(existData) {
                duplicatedFields.push(field) //pushea elementos de los campos si esta duplicado
            }
        } 
    }
    
    if(duplicatedFields.length > 0) {
        const fieldsString = duplicatedFields.map(field => `"${field}"`).join(', '); // por cada campo devuelve string con ese campo y lo junte con comilla, comillas es buena practica
        throw new ValidationError(`Los campos ${fieldsString} ya están en uso por otro registro en "${Modelo.name}"`)
    } 
}