
import { ValidationError } from "../errors/typeErrors.js";
import { Usuario }  from "../models/Usuario.model.js"
import { validateExistData } from "../utils/Validate.js";


export const createUser = async(req, res, next) => {
    try {

        await validateExistData(Usuario, req.body, 'email');
        await validateExistData(Usuario, req.body, 'telefono');
        
        const user = await Usuario.create(req.body);
        
        console.log(user)
        res.status(201).json({
            message: 'Usuario creado con éxito',
            status: 201,
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async(req, res, next) => {
    try {
      const users = await Usuario.findAll()
      res.status(200).json({
        message: 'Usuarios obtenidos con éxito',
        status: 200,
        data: users
      })
    } catch (error) {
     next(error)
    }
  }

  export const getAllActiveUsers = async(req, res, next) => {
    try {
        const users = await Usuario.findAll({
            where: { active: true }  // campo donde va la condicion
        });

        res.status(200).json({
          message: "Usuarios encontrados con éxito",
          status: 200,
          data: users,
        });
    } catch (error) {
        next(error)
    }
}

export const getUsersByFilters = async(req, res) => {
    try {
        const filters = req.query; //Esto devuelve un objeto con los filtros
        const whereCluase = {}; //para generar las clausulas

        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {  //si en cada filtro tiene la propiedad key 
                whereCluase[key] = filters[key] // si la tiene la key pasa a filtro con la key y valor
                //aqui irian mas condiciones si query fuera mas complicada
            }
        }

        const users = await Usuario.findAll({ 
            where: { ...whereCluase, active: true } //todos los campos de whereClauses mas los active
            
        })

        res.status(200).json({
          message: "Usuarios encontrados con éxito",
          status: 200,
          data: users,
        });
    } catch (error) {
        next(error);
    }
}

//filters puedo mandar varios valores

export const getUserById = async( req, res ) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id) //pk de primary key que es el id

        res.status(200).json({
          message: "Usuario encontrado con éxito",
          status: 200,
          data: user,
        });
    } catch (error) {
        console.error(error);
    }
}


export const getActiveUserById = async(req, res) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findOne({
            where: { id, active: true} //busca por id y que sea activo
        })

        res.status(200).json({
          message: "Usuario encontrado con éxito",
          status: 200,
          data: user,
        });
    } catch (error) {
        console.error(error);
    }
}



export const updateUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        await validateExistData(  //para que no se repitan datos unique, ni se quede pegado
          Usuario,
          updateData,
          "email",
          id
        );

        const [ updateRows, [ updateUser ] ] = await Usuario.update(updateData, { //update devuelve array , 1er arg  data que se va a modificar y 2do arg opciones de configuracion
            where: { id, active: true },
            returning: true  // este returning ayuda que cuando se devuelva data se pueda ver
        });

        if(updateRows === 0) {
            throw new ValidationError(`No se encontro al usuario con el ID: ${id}`)
        }

        res.status(200).json({
            message: "Usuario actualizado con éxito",
            status: 200,
            data: updateUser
        })
    } catch (error) {
        next(error)
    }
}


//para update solo un dato se podria usar metodo PATCH pero al final es poco practica, con PUT se manda toda la info , la que se modifica y la que sigue igual


//spread ... esparce, cuando hago sobre una referencia que existe
//rest ... agrupa,  se usa mucho en func, cuando no tengo la referencia
//rest llega como []


/*
const sumarNumeros = (num1, num2, ... nums)
const num = (... nums)


*/