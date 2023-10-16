import express from 'express';
import routes from './routes/routes';
import 'dotenv/config';
import morgan from 'morgan';
import { mongooseConnect } from './instances/mongoose.instance';
import { addHeader } from './controllers/auth.controller';

const app = express();

mongooseConnect();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('*', addHeader);

app.listen(process.env.PORT, () => {
	console.log(`app listening on port ${process.env.PORT}`);

	routes(app);
});
