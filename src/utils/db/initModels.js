import { dbConfig } from "../../config/db.config.js";
import { DataBaseError } from "../../errors/typeErrors.js";
import { initProducto } from "../../models/Producto.model.js";
import { initUsuario } from "../../models/Usuario.model.js"
import { initVenta } from "../../models/Venta.model.js";
import { initVentasProductos } from "../../models/VentaProducto.model.js";

export const initModels = (config) => {
    try {
        initUsuario(config);
        initProducto(config);
        initVenta(config);
        initVentasProductos(dbConfig);
    } catch (error) {
        console.error(error)
        throw new DataBaseError('Error al iniicializar los modelos')
    }
}

//para que corra todos los modelos de config
//no es una promesa , es un proceso imperativo, por eso no usa async/await
//es de una sola via