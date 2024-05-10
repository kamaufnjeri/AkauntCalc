import express, { Response, Request} from 'express';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', async (req: Request, res: Response) => {
    res.json('Welcome to AkauntCalc!');

});

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}`);
});
