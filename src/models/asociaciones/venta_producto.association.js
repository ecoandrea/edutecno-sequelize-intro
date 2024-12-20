import { Venta } from "../Venta.model.js";
import { Producto } from "../Producto.model.js";
import { VentasProductos } from "../VentaProducto.model.js";


//Esto es un caso de Muchos es a Muchos
export const setupVentaProducto = () => {
    Venta.belongsToMany(Producto, { //pertenece a muchas
        through: VentasProductos, // pasa entremedio, a traves, en vez de pasar string con nombre, paso modelo entero
        foreignKey: 'ventaId',
        otherKey: 'productoId', // es la otra key que pasa por intermedia
        as: 'productos'
    })

    Producto.belongsToMany(Venta, {
        through: VentasProductos, // 
        foreignKey: 'productoId',
        otherKey: 'ventaId',
        as: 'ventas'
    })

}

