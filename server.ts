import express, { Request, Response } from 'express'
import dotenv from "dotenv";
import { DBUtil } from './util/DBUtil';
import userRouter from './routers/userRouter';
import categoriesRouter from './routers/categoriesRouter';
import productRouter from './routers/productsRouter';
import addressRouter from './routers/addressRouter';
import cartRouter from './routers/cartRouter';
import orderRouter from './routers/ordersRouter';

const app: express.Application = express();

dotenv.config({
    path: "./.env"
});

const hostName: string | undefined = process.env.EXPRESS_HOST_NAME;
const port: string | undefined = process.env.EXPRESS_PORT;
const dbUrl: string | undefined = process.env.MONGO_DB_CLOUD_URL;
const dbName: string | undefined = process.env.MONGO_DB_DATABASE;


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        msg: "Inside Server Get Request",
    })
});

app.use(express.json());
app.use("/users", userRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productRouter);
app.use('/addresses', addressRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);


if (port && hostName) {
    app.listen(Number(port), hostName, () => {
        if (dbName && dbUrl) {
            DBUtil.connectToDb(dbUrl, dbName).then((dbResponce) => {
                console.log(dbResponce);
            }).catch((err) => {
                console.log(err);
                process.exit(0);
            })
            console.log(`Server Start At http://${hostName}:${port}`);
        }
    })
}
