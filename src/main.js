import express from 'express';
import {engine} from 'express-handlebars'
import path from 'path'
import cors from 'cors'

import { serverInit } from './services/serverInit.js';

import router from './routes/routes.js'
import viewsRouter from './routes/views.routes.js'
import { errorHandler } from './middlewares/errorHandlers.js';

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(process.cwd(), 'public')))

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//seria plantilla de handlebars
app.engine('.hbs', engine({ //primer engine es de express, 2do se pasa como argumento y es de handlebars
    extname: '.hbs', //extension, sino se especifica asume que sera handlebar, es opcional
    layoutsDir: path.join(process.cwd(), 'src', 'views', 'layouts'),// crea camino, es obligatorios
    defaultLayout: 'main', //por defecto es main , no seria necesario escribirlo, es opcional
    partialsDir: path.join(process.cwd(), 'src', 'views', 'partials'), //obligatorio
     /* runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    } */
}));


//process.cwd busca desde disco local c el current carpeta hasta src la carpeta donde se esta trabajando

//setear funcionamiento de vistas 

app.set('views', path.join(process.cwd(), 'src', 'views')) //Con esto corremos todas las vistas incluso las que estan fuera de partials
app.set('view engine', '.hbs');

//hasta aqui seria plantilla , se debe incluir import de engine y path

//CWD => Current Working Directory

app.use('/api/v1', router)
app.use('', viewsRouter)

app.use(errorHandler);

app.get('/', (req, res) => {
    res.render('pages/home') //busca lo que esta en pages y saca el home, busca listas seteadas
})

serverInit(app, PORT)

//render necesita una vista, render es dibujar
//para que fx se configuran las vistas que es 1er arg  y se saca de la ubicacion 2do argumento
//app.set('views', path.join(process.cwd(), 'src', 'views'))