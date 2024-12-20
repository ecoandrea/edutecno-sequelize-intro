import { DataBaseError } from "../../errors/typeErrors.js";
import { setupUsuarioVenta } from "../../models/asociaciones/usuario_venta.association.js"
import { setupVentaProducto } from "../../models/asociaciones/venta_producto.association.js";

export const setupAssociation = () => {
    try {
        setupUsuarioVenta();
        setupVentaProducto();
    } catch (error) {
        console.error('Error al inicializar las relaciones', error);
        throw new DataBaseError('Error al iniicalizar las asociaciones', error)
    }
}

//aqui se corren las funciones de asociaciones de modelos y avisa si hay un error