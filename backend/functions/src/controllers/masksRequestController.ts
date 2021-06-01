import { Response } from "express";
import { firestore } from "firebase-admin";
import { db } from "../config/firebase";
import { v4 as uuidv4 } from 'uuid';

type MaskRequestType = {
    "id": string,
    //"createdAt": Date,
    "name": string,
    "avatar": string,
    "email": string,
    "phone": string
    "samithi": string,
    "address": string,
    "city": string,
    "state": string,
    "postalcode": string,
    "quantity": Number,
    "status": string,
    "comments": string,
    "createdAt": Date,
    "updatedAt": Date
}

type ShipingRequestType = {


    "docketNumber": string,
    "shipDate": Date,
    "courier": {
        "name": string,
        "company": string,
        "contact": Number,
        "email": string,
    },
    "status": string

}

type Request = {
    body: MaskRequestType,
    params: { maskRequestId: string }
};

type ShippingRequest = {
    body: ShipingRequestType,
    params: { maskRequestId: string }
}

const addEntry = async (req: Request, res: Response) => {

    console.log(`addEntry request is `, JSON.stringify(req.body));
    const { name, email, phone, samithi, address, city, state, postalcode, quantity, comments } = req.body;
    try {




        if (!req.params.maskRequestId) {
            req.params.maskRequestId = uuidv4();
        }

        console.log('Your maskRequist ID is: ' + req.params.maskRequestId);
        const maskRequestObject = {

            name, email, phone, samithi, address, city, state, postalcode, quantity, comments, status: "new",
            createdAt: firestore.FieldValue.serverTimestamp()
        };

        const newMaskRequest = db.collection("maskrequests").doc(req.params.maskRequestId);
        await newMaskRequest.set(maskRequestObject);

        res.status(200).send({
            status: "success",
            message: "new mask request created successfully",
            data: maskRequestObject
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getAllEntries = async (req: Request, res: Response) => {
    console.log(`getAllEntries requested`)
    try {
        const allEntries: MaskRequestType[] = [];
        const querySnapshot = await db.collection("maskrequests").get();
        querySnapshot.forEach((doc: any) => {

            let nextMaskRequest = doc.data();
            nextMaskRequest.id = doc.id;
            allEntries.push(nextMaskRequest);

        });
        return res.status(200).json(allEntries);
    } catch (error) { return res.status(500).json(error.message); }
}

const getEntry = async (req: Request, res: Response) => {
    console.log(`getEntry requested`)
    try {


        console.log(`maskRequestId ${req.params.maskRequestId}`)
        const entry = db.collection("maskrequests").doc(req.params.maskRequestId);;

        const docData = await entry.get();
        let currentData: any = {}
        if (docData) {
            currentData = await docData.data();
            currentData.id = docData.id;

            if (currentData.createdAt) {

                console.log("converting createdAt ")
                currentData.createdAt = new Date(currentData.createdAt._seconds * 1000)

                console.log(currentData.createdAt)
            } else {

                console.log("currentData.createdAt does not exist  ", currentData)
            }

        } else {

            console.log(`doc not found of the maskrequest id : ${req.params.maskRequestId}`)

        }

        return res.status(200).json(currentData);
    } catch (error) { return res.status(500).json(error.message); }
}

const updateEntry = async (req: ShippingRequest, res: Response) => {
    console.log(`updateEntry requested`)
    //const { body: { docketNumber, shipDate } } = req;

    try {
        const entry = db.collection("maskrequests").doc(req.params.maskRequestId);
        const currentData = (await entry.get()).data() || {};

        const maskRequestObject = {
            name: currentData.title,
            email: currentData.text,
            phone: currentData.phone,
            samithi: currentData.samithi,
            address: currentData.address,
            city: currentData.city,
            state: currentData.state,
            postalcode: currentData.postalcode,
            quantity: currentData.qunatity,
            status: currentData.status,
            comments: currentData.comments,
            updatedAt: firestore.FieldValue.serverTimestamp()

        };

        await entry.set(maskRequestObject).catch(error => {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        })

        return res.status(200).json({
            status: "success",
            message: "entry updated successfully",
            data: maskRequestObject
        });
    }
    catch (error) { return res.status(500).json(error.message); }

}

const deleteEntry = async (req: Request, res: Response) => {
    const { maskRequestId } = req.params;

    try {
        const entry = db.collection("maskrequests").doc(maskRequestId);

        await entry.delete().catch(error => {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        })

        return res.status(200).json({
            status: "success",
            message: "entry deleted successfully",
        });
    }
    catch (error) { return res.status(500).json(error.message); }
}


const shippingProvider = async (req: ShippingRequest, res: Response) => {

    console.log(`updateEntry requested`)
  //  const { body: { name, email, phone, samithi, address, city, state, postalcode, quantity, status, comments }, params: { maskRequestId } } = req;

    try {


        return res.json({message:"impl no ready"});
    } catch (error) { return res.status(500).json(error.message); }
}

export { addEntry, getEntry, getAllEntries, updateEntry, deleteEntry ,shippingProvider}