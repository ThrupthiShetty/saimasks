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
    createdAt: Date,
    updatedAt: Date
}

type Request = {
    body: MaskRequestType,
    params: { maskRequestId: string }
};

const addEntry = async (req: Request, res: Response) => {

    console.log(`addEntry request is `,JSON.stringify(req.body));
    const { name, email, phone, samithi, address, city, state, postalcode, quantity } = req.body;
    try {
        const newMaskRequest = db.collection("maskrequests").doc();



        if (!req.params.maskRequestId) {
           req.params.maskRequestId = uuidv4();
        }

        console.log('Your maskRequist ID is: ' + req.params.maskRequestId);
        const maskRequestObject = {
            id: req.params.maskRequestId,
            name, email, phone, samithi, address, city, state, postalcode, quantity, status: "new"
        };
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
    try {
        const allEntries: MaskRequestType[] = [];
        const querySnapshot = await db.collection("maskrequests").get();
        querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));
        return res.status(200).json(allEntries);
    } catch (error) { return res.status(500).json(error.message); }
}

const updateEntry = async (req: Request, res: Response) => {
    const { body: { name, email, phone, samithi, address, city, state, postalcode, quantity, status }, params: { maskRequestId } } = req;

    try {
        const entry = db.collection("maskrequests").doc(maskRequestId);
        const currentData = (await entry.get()).data() || {};

        const maskRequestObject = {
            name: name || currentData.title,
            email: email || currentData.text,
            phone: phone || currentData.phone,
            samithi: samithi || currentData.samithi,
            address: address || currentData.address,
            city: city || currentData.city,
            state: state || currentData.state,
            postalcode: postalcode || currentData.postalcode,
            quantity: quantity || currentData.qunatity,
            status: status || currentData.status,
            createdAt: firestore.FieldValue.serverTimestamp(),
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

export { addEntry, getAllEntries, updateEntry, deleteEntry }