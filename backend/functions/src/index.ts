import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import { addEntry, deleteEntry, getAllEntries, getEntry, updateEntry } from "./controllers/masksRequestController";

const app = express();


//app.use(cors());

const corsHandler = cors({origin: true});

app.use(corsHandler);

app.use(express.json());

let demoLogger = (req: any, res: any, next: any) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${formatted_date}] ${method}:${url} ${status} \n ${JSON.stringify(req.body)}`;
    console.log(log);
    next();
};
app.use(demoLogger);
app.get("/", (req, res) => res.status(200).send("Hey there!..I am up for sure :)"));
app.post("/maskrequests", addEntry);
app.get('/maskrequest/:maskRequestId', getEntry)
app.get('/maskrequests', getAllEntries)
app.patch('/maskrequests/:maskRequestId', updateEntry)
app.delete('/maskrequests/:maskRequestId', deleteEntry)
exports.maskapp = functions.https.onRequest(app);
