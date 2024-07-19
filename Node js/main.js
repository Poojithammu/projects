import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import {engine} from 'express-handlebars';
import { fileURLToPath } from 'url';
import {router} from './routes/studentRoutes.js';
import { getHomePage } from './controllers/studentController.js';


dotenv.config();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
app.use("/", router);
app.get("/", getHomePage);


app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
});
