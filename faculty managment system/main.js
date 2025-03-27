import express from 'express';
import {router} from './routes/facultyRoutes.js';
import path from 'path';
import bodyParser from 'body-parser';
import {engine} from 'express-handlebars';
import { fileURLToPath } from 'url';

const PORT = 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: false,
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/pages')));

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/', router);