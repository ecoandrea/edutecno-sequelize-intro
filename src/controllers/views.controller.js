import { Producto } from "../models/Producto.model.js"

export const renderHomePage = (req, res) => {
    res.render('pages/home')
}

export const renderAboutPage = (req, res) => {
    res.render('pages/about')
}

export const renderListProduct = async(req, res, next) => {
    try {
        const products = await Producto.findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          /* plain: true, */ //Usarlo cuando tengamos un findOne más eficiente
          raw: true //Usarlo cuando tengamos un findAll con muchos datos o en filtros con muchos datos
        });

        /* const productos = products.map(product => product.get({ plain: true })) */

        res.render('productos/list', { products })// 2do argumento es el objeto que tiene nombre de lo que esta pidiendo y su valor
    } catch (error) {
        next(error)
    }
}

//raw transforma rspta de sequelize (instancia prototype) a texto plano

export const renderRegisterForms = (req, res) => {
    res.render('usuarios/register')
//es mas simple porque la op de registro la hace createUser
}

export const renderRegisterSuccess = (req, res) => {
    res.render('usuarios/successRegister')
}