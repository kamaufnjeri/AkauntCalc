import express, { Response, Request} from 'express';
import bodyParser from 'body-parser';
import passport from './config/passport';
import sequelize from './config/database.config';
import UserRoutes from './routes/UserRoutes';
import CompanyRoutes from './routes/CompanyRoutes';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', async (req: Request, res: Response) => {
    res.json('Welcome to AkauntCalc!');
});

app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/company', CompanyRoutes);

// Sync models with database
sequelize.sync({ alter: true })
.then(() => {
    console.log('Database synchronized successfully.');  
})
.catch(err => {
    console.error('Error synchronizing database:', err);
});

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}`);
});
