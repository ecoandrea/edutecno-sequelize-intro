import express from 'express';
import {engine} from 'express-handlebars'
import path from 'path'

import { serverInit } from './services/serverInit.js';

import router from './routes/routes.js'
import { errorHandler } from './middlewares/errorHandlers.js';

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static(path.join(process.cwd(), 'public')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('.hbs', engine({ //primer engine es de express, 2do se pasa como argumento y es de handlebars
    extname: '.hbs', //extension
    layoutsDir: path.join(process.cwd(), 'src', 'views', 'layouts'),// crea camino
    defaultLayout: 'main',
    partialsDir: path.join(process.cwd(), 'src', 'views', 'partials')
}));


//process.cwd busca desde disco local c el current carpeta hasta src la carpeta donde se esta trabajando

//setear funcionamiento de vistas en 

app.set('views', path.join(process.cwd(), 'src', 'views')) //Con esto corremos todas las vistas incluso las que estan fuera de partials
app.set('view engine', '.hbs');



//CWD => Current Working Directory

app.use('/api/v1', router)

app.use(errorHandler);

app.get('/', (req, res) => {
    res.render('pages/home') //busca lo que esta en pages y saca el home
})

serverInit(app, PORT)