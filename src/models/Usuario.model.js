import { Model, DataTypes } from 'sequelize'
/* import { dbConfig } from '../config/db.config.js' */


export class Usuario extends Model{}

export const initUsuario = (dbConfig) => {
    Usuario.init( //metodo init lo hereda de Model, 1er objeto estructura datos de tabla, 2do como son las configuraciones
      {
        id: {
          type: DataTypes.UUID, //tipos de datos
          defaultValue: DataTypes.UUIDV4, //si no mandan nada , valor por defecto
          primaryKey: true,
          //estos 3 son abstraccion pura
        },
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El nombre no puede ser un campo vacío" },
            len: {
              args: [2, 100],
              msg: "El nombre no puede ser menor a 2 ni mayor a 100 carácteres",
            },
            is: {
              args: /^[a-zA-ZÁ-ÿñÑ\s]+$/,
              msg: "El nombre solo puede contener letras del abecedario español",
            },
          },
        },
        apellido_paterno: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El apellido no puede ser un campo vacío" },
            len: {
              args: [2, 50],
              msg: "El apellido paterno debe tener entre 2 y 50 carácteres",
            },
            is: {
              args: /^[a-zA-ZÁ-ÿñÑ\s]+$/,
              msg: "El nombre solo puede contener letras del abecedario español",
            },
          },
        },
        apellido_materno: {
          type: DataTypes.STRING,
          validate: {
            len: {
              args: [2, 50],
              msg: "El apellido materno debe tener entre 2 y 50 carácteres",
            },
            is: {
              args: /^[a-zA-ZÁ-ÿñÑ\s]+$/,
              msg: "El nombre solo puede contener letras del abecedario español",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: { msg: "El correo electrónico ingresado ya está en uso" },
          validate: {
            notEmpty: { msg: "El correo no puede ser un campo vacío" },
            isEmail: { msg: "El correo electrónico ingresado no es válido" },
          },
        },
        telefono: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El Teléfono no puede estar vacío" },
            is: {
              args: /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/,
              msg: "El número de teléfono ingresado no es válido",
            },
          },
        },
      },
      {
        sequelize: dbConfig, //coneccion base de dato
        modelName: "Usuario", //para invocar dentro de servicio
        tableName: "usuarios", // para invocar dentro de tabla
        timestamps: true,
        paranoid: true, // habilito el soft delete al usar destroy - pero, agrega un campo nuevo llamado deleteAt
      }
    );
  }


   

/* export default Usuario */

//notNull, se asegura que no sea null, notEmpty que no sea ni nullni undefined
//.init construye tabla

//usando paranoid no es necesario usar active , que es mas cuando se hace manual y no usando sequelize