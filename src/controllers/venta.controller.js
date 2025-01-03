import { dbConfig } from "../config/db.config.js"
import { ValidationError } from "../errors/typeErrors.js";
import { Producto } from "../models/Producto.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { Venta } from "../models/Venta.model.js";
import { VentasProductos } from "../models/VentaProducto.model.js";
import { isEmptyData, isValidDate, notFoundDataRequestByPk } from "../utils/validations/Validate.js";

//ACID => Atomicidad - Consistencia - Aislamiento - Durabilidiad (Persistencia)
//transaction de sequelize recibe configuracion de begin

export const createVentaConProducto = async(req, res, next) => {
    const transaction = await dbConfig.transaction() //Esto ya da inicio al BEGIN de la transación
    
    try {
        //ID del usuario - 1 a muchos -> Un solo dato - String
        //objetos Productos -> Array<objetos>
            //ID de productos 
            //Precio de cada producto -------|_____subtotal
            //Cantidad de cada Producto -----|
        //fecha -> Puede o no puede estar, Si no esta, es un NOW()
            
        //Total -> Calculable
        //1. Guardamos los datos desde la request 
        const { usuarioId, productos, fechaVenta } = req.body;
        
        //2. Válidamoos que llegue la requiest, fecha puede o no estar
        isEmptyData(usuarioId, 'ID del usuario'); //Este válida que llego un ID desde la request
        isEmptyData(productos, 'Productos');

        //.3Verificamos que el usuario esta
        await notFoundDataRequestByPk(Usuario, usuarioId, true, transaction); //Este válida que EXISTE un usuario activo en este ID
  
        //4. Confirmamos los productos 4.5 Podemos sacar el total y el subttotal
        let total = 0
        for(const producto of productos) {
            if(!producto.productoId || !producto.cantidad || producto.cantidad <= 0) {
                throw new ValidationError(`Cada producto debe contener los campos productoId y cantidad mayor que 0`)
            }

            const productoData = await notFoundDataRequestByPk(Producto, producto.productoId, true, transaction);
            
            const subtotal = productoData.precio * producto.cantidad
            total += subtotal
        }

        //5. Verificar si se mando una fecha, sino mandar la fecha actual
        /* if (!fecha) return fecha = Date.now();
        const parseDate = new Date(fecha); //string que manden lo convierte en formato date

        if (isNaN(parseDate.getTime())) { // evita que mqnden un 31 de febrero
          throw new ValidationError(
            "La fecha debe tener el formato adecuado de YYYY-MM-DD"
          );
        }
        fecha = parseDate  // si la fecha est correcta
        */
        const fecha = isValidDate(fechaVenta) //lo que llego pero se reasignado validado

        //6.Crear el registro de venta 

      //6.Crear el registro de venta 

      const ventaData = {
        usuarioId,
        fecha,
        total
    }

    const venta = await Venta.create(ventaData, { transaction: transaction }); // esto se asegura que sea atomico

    //De aquí hasta el COMMIT no es necesario para la Prueba... El Alan se agilo con este ejercicio

    //7. Insertar los detalles de las venta en VentaProducto , es relac muchos a muchos de Venta y Producto

    for(const producto of productos) {
        const productoData = await notFoundDataRequestByPk(Producto, producto.productoId, true, transaction);

        const subtotal = productoData.precio * producto.cantidad;

        //productoData.precio esto sale de la bd,  producto.cantidad esto de la peticion

        //8. Objeto con la data de Venta Producto para guardar la referencia en la base de datos
        const ventaPoductoData = {
            ventaId: venta.id,
            productoId: productoData.id,
            cantidad: producto.cantidad,
            subtotal
        }
        //Esto si lo tienen que hacer pero solo con los IDs, sin los campos adicionales para la prueba
        await VentasProductos.create(ventaPoductoData, { transaction: transaction });

        productoData.stock = productoData.stock - producto.cantidad;
        productoData.save();
    }

    await transaction.commit();

    res.status(201).json({
        message: 'Venta creada con éxito',
        status: 201,
        data: venta
    })
} catch (error) {
    console.error(error)
    await transaction.rollback()
    next(error)
}
}


//Begin
//Commit
//Rollback

//Inicializacion debe estar antes del try , porque si esta dentro el scope no dejaria hacer el rollback
//Begin, Commit, Rollback siempre van con await son asincronas porq se conectan con DB

//ID del usuario - 1 a mucho - un solo dato - string
//ID de productos - muchos a muchos array
//Precio de cada producto - muchos -array
//Cantidad de cada producto muchos - array 
//Total
//Fecha

export const getAllSalesWithDetails = async(req, res, next) => {
    try {
        const sales = await Venta.findAll({
            include: [  //este hace el JOIN , siempre es array
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'apellido_paterno', 'email'] //siempre en array porq pueden ser varios
                },
                //otro JOIN
                {
                    model: Producto,
                    as: 'productos',
                    //Este throught busca automaticamente a la tabla intermedia declarada en las asociaciones
                    through: { 
                        attributes: ['cantidad', 'subtotal'] //dentro de through lo saca de intermedia
                    },
                    attributes: ['id', 'nombre', 'precio'] //fuera de through lo saca de Producto
                }
            ],
            order: [['createdAt', 'DESC']] //order siempre en array
        })

        res.status(200).json({
            message: 'Ventas obtenidas con éxito',
            status: 200,
            data: sales
        })
    } catch (error) {
        next(error)
    }
}


export const getSaleByUserId = async(req, res, next) => {
    try {
        const { usuarioId } = req.params;

        const sales = await Venta.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email', 'telefono']
                },
                 {
                    model: Producto,
                    as: 'productos',
                    //Este throught busca automaticamente a la tabla intermedia declarada en las asociaciones
                    through: {
                        attributes: ['cantidad', 'subtotal']
                    },
                    attributes: ['id', 'nombre', 'precio']
                }
            ],
            attributes: { exclude: ['usuarioId', 'updatedAt']},
        })

        res.status(200).json({
            message: 'Ventas obtenidas con éxito',
            status: 200,
            data: sales
        })
    } catch (error) {
        next(error)
    }
}