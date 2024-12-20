import { Model, DataTypes } from "sequelize"; //Datatypes no es obligacion , pero es bueno para validar directamente en modelo


export class Producto extends Model{};

export const initProducto = (dbConfig) => {
    Producto.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'El nombre del producto no puede ser un campo vacío'},
                len: {
                    args: [2, 100],
                    msg: 'El nombre del producto debe tener entre 2 y 100 caracteres',
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        precio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0 //no puede bajar de 0
            }
        }
    },
    {
        sequelize: dbConfig,
        modelName: 'Producto',
        tableName: 'producto',
        timestamps: true
    }

)
}