
import { NotFoundError, ValidationError } from "../errors/typeErrors.js";
import { Usuario }  from "../models/Usuario.model.js"
import { validateExistData } from "../utils/validations/Validate.js";


export const createUser = async(req, res, next) => {
    try {

        await validateExistData(Usuario, req.body, ['email', 'telefono']);

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
      const users = await Usuario.findAll({paranoid : false})

      isEmptyResponseData(users)

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
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt'] //info que se excluye porque no es necesaria para usuario o sensible
            }
        });

        isEmptyResponseData(users);
        

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
            where: { ...whereCluase }, //todos los campos de whereClauses mas los active
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            
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

export  const getUserByIdIncludeDeleted = async( req, res, next ) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id, { paranoid: false }); //pk de primary key que es el id

        isEmptyResponseData(user);


        res.status(200).json({
          message: "Usuario encontrado con éxito",
          status: 200,
          data: user,
        });
    } catch (error) {
        next(error)
    }
}


export const getActiveUserById = async(req, res, next) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findOne({
            where: { id}, //busca por id y que sea activo
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        })

        isEmptyResponseData(user);

        res.status(200).json({
          message: "Usuario encontrado con éxito",
          status: 200,
          data: user,
        });
    } catch (error) {
        next(error)
    }
}



export const updateUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        await validateExistData(  //para que no se repitan datos unique, ni se quede pegado
          Usuario,
          updateData,
          ["email"],
          id
        );

        const [ updateRows, [ updateUser ] ] = await Usuario.update(updateData, { //update devuelve array , 1er arg  data que se va a modificar y 2do arg opciones de configuracion
            where: { id },
            returning: true,  // este returning ayuda que cuando se devuelva data se pueda ver
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } //con attributes solo se muestra lo que se quiere mostrar

        });

        if(updateRows === 0) {
            throw new NotFoundError(`No se encontro al usuario con el ID: ${id}`)
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


    export const deletUser = async (req, res) => {
            try {
                const { id } = req.params
                
                const user = await Usuario.findByPk(id);
        
                isEmptyResponseData(user);

                await user.destroy(); 

        /*
        user.active = false
        await user.save() //para restaurar
        
        */
        //destroy se llama desde objeto que se pide,  () si se deja vacio por defecto hace un softDelete , en DB lo bloquea para que no se encuentre, pero se puede hacer un restore si se necesita.

        res.status(200).json({
            message: 'Usuario Eliminado con éxito',
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}


export const restoreUser =  async(req, res, next) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, { paranoid: false })

        isEmptyResponseData(user);
        if(usuario.deletedAt === null) throw new ValidationError('El usuario no ha sido eliminado');

        await usuario.restore();

        res.status(200).json({
          message: "Usuario Restaurado con éxito",
          status: 200,
          data: usuario
        });
    } catch (error) {
        next(error)
    }
}


export const physicDeletUser = async (req, res) => {
    try {
        const { id } = req.params
        
        const user = await Usuario.findByPk(id);

        if(!user) {
            throw new NotFoundError('No encontramos al usuario que deseas eliminar');
        }

        await user.destroy( { force: true } ); //cuidado porque borra permanente

        res.status(200).json({
            message: 'Usuario Eliminado con éxito',
            status: 200,
        })
    } catch (error) {
        next(error)
    }
}

//para update solo un dato se podria usar metodo PATCH pero al final es poco practica, con PUT se manda toda la info , la que se modifica y la que sigue igual

//para incluir los que estan con softDelete se pone paranoid: false

//spread ... esparce, cuando hago sobre una referencia que existe
//rest ... agrupa,  se usa mucho en func, cuando no tengo la referencia
//rest llega como []


/*
const sumarNumeros = (num1, num2, ... nums)
const num = (... nums)


*/