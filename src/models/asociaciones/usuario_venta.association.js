import { Usuario } from "../Usuario.model.js";
import { Venta } from "../Venta.model.js";

//uno es a mucho
export const setupUsuarioVenta = () => {
    Usuario.hasMany(Venta, {
        foreignKey: 'usuarioId',
        as: 'ventas'
    });
    
    Venta.belongsTo(Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario'
    })

}

//usuario tiene mucho Venta
//venta pertenece a Usuario
//foreign key deben coincidir y hacer match
//se usa alias