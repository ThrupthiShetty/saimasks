// import { Response } from "express";
import { firestore } from "firebase-admin";
import { db } from "../config/firebase";
import { v4 as uuidv4 } from 'uuid';

import { Response } from 'express';

import * as fs from 'fs';

const MASK_REQUESTS_COLLECTION = "maskrequests";
const TEST_MASK_REQUESTS_COLLECTION = "testmaskrequests";
const CONTRIBUTER_COLLECTION = "contributoins";

const TEST_CONTRIBUTER_COLLECTION = "testcontributoins";

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

type ContributeRequestType = {


    "name": string,
    "email": string,
    "phoneNumber": string,
    "status": string,
    "comments": string

}

type MaskRequest = {
    body: MaskRequestType,
    params: { maskRequestId: string },
    headers: any
};


type Request = {
    body?: any,
    params: { maskRequestId: string },
    headers: any
};
type ShippingRequest = {
    body: ShipingRequestType,
    params: { maskRequestId: string },
    headers: any

}


type ContributeRequest = {
    body: ContributeRequestType,
    params: { maskRequestId: string },
    headers: any

}

const addEntry = async (req: MaskRequest, res: Response) => {

    console.log(`addEntry request is `, JSON.stringify(req.body));
    //console.log(`headers ${req.headers}`)
    const { name, email, phone, samithi, address, city, state, postalcode, quantity, comments } = req.body;
    try {

        if (!req.params.maskRequestId) {
            req.params.maskRequestId = uuidv4();
        }
        console.log('Your maskRequist ID is: ' + req.params.maskRequestId);
        let maskRequestObject = {

            name, email, phone, samithi, address, city, state, postalcode, quantity, comments, status: "new",
            createdAt: firestore.FieldValue.serverTimestamp()
        };

        const dbcollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ? db.collection(TEST_MASK_REQUESTS_COLLECTION) : db.collection(MASK_REQUESTS_COLLECTION);
        const newMaskRequest = dbcollection.doc(req.params.maskRequestId);
        await newMaskRequest.set(maskRequestObject);

        await getEntry(req, res);
        // maskRequestObject.id =  req.params.maskRequestId;

        // res.status(200).send({
        //     status: "success",
        //     message: "new mask request created successfully",
        //     data: maskRequestObject
        // });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getAllEntries = async (req: Request, res: Response) => {
    console.log(`getAllEntries requested`)
    try {
        const allEntries: MaskRequestType[] = [];

        const dbcollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ? db.collection(TEST_MASK_REQUESTS_COLLECTION) : db.collection(MASK_REQUESTS_COLLECTION);

        const querySnapshot = await dbcollection.get();
        querySnapshot.forEach((doc: any) => {

            let nextMaskRequest = doc.data();

            //  let displayResponse = await mapDisplay(nextMaskRequest, doc.id, "public")
            //nextMaskRequest.id = doc.id;

            let displayView: any = {};
            displayView.id = doc.id;
            displayView.name = nextMaskRequest.name;
            displayView.quantity = nextMaskRequest.quantity;
            displayView.createdAt = nextMaskRequest.createdAt;
            displayView.status = nextMaskRequest.status;
            displayView.city = nextMaskRequest.city;
            allEntries.push(displayView);

        });
        return res.status(200).json(allEntries);
    } catch (error) { return res.status(500).json(error.message); }
}

const getEntry = async (req: Request, res: Response) => {
    console.log(`getEntry requested`)

    //console.log(req.headers)
    try {


        console.log(`maskRequestId ${req.params.maskRequestId}`)

        const dbcollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ? db.collection(TEST_MASK_REQUESTS_COLLECTION) : db.collection(MASK_REQUESTS_COLLECTION);

        const entry = await dbcollection.doc(req.params.maskRequestId);;
        //  console.log("i am here")
        const docData = await entry.get();
        let currentData: any = await docData.data();

        //  console.log("nnn", currentData)
        if (currentData) {

            currentData.id = docData.id;

            if (currentData.createdAt) {

                console.log("converting createdAt ")
                currentData.createdAt = new Date(currentData.createdAt._seconds * 1000)

                console.log(currentData.createdAt)
            } else {

                console.log("currentData.createdAt does not exist  ", currentData)
            }

            return res.status(200).json(currentData);

        } else {

            console.log(`doc not found of the maskrequest id : ${req.params.maskRequestId}`)

            return res.status(400).json({ message: "request not found for " + req.params.maskRequestId });

        }


    } catch (error) { return res.status(500).json(error.message); }
}

const contributeEntry = async (req: ContributeRequest, res: Response) => {
 //   console.log(`contributeEntry requested`)
    //const { body: { docketNumber, shipDate } } = req;

    try {



        const contributeRequestId = uuidv4();

        console.log('Your contributeRequestId ID is: ' + contributeRequestId);

        const contribdbcollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ? 
        db.collection(TEST_MASK_REQUESTS_COLLECTION)
        .doc(req.params.maskRequestId)
        .collection(TEST_CONTRIBUTER_COLLECTION) 
        : db.collection(MASK_REQUESTS_COLLECTION)
        .doc(req.params.maskRequestId)
        .collection(CONTRIBUTER_COLLECTION);

        const newContributeRequest = {
           name: req.body.name,
           email: req.body.email,
           phoneNumber : req.body.phoneNumber,
           comments : req.body.comments,
           createdAt: firestore.FieldValue.serverTimestamp()
        }

        const newContributeRequestDoc = contribdbcollection.doc(contributeRequestId);
        await newContributeRequestDoc.set(newContributeRequest).catch(error => {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        });

       return await getEntry(req, res);
    }
    catch (error) { return res.status(500).json(error.message); }

}

const updateEntry = async (req: ShippingRequest, res: Response) => {
    console.log(`updateEntry requested`)
    //const { body: { docketNumber, shipDate } } = req;

    try {

        const dbcollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ? db.collection(TEST_MASK_REQUESTS_COLLECTION) : db.collection(MASK_REQUESTS_COLLECTION);

        const entry = dbcollection.doc(req.params.maskRequestId);
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

        // const dbcollection =  ((req.headers['env'] && req.headers['env'] === 'testenv')) ? db.collection(TEST_MASK_REQUESTS_COLLECTION) : db.collection(MASK_REQUESTS_COLLECTION);

        const entry = db.collection("maskrequests-backup").doc(maskRequestId);

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


        return res.json({ message: "impl no ready" });
    } catch (error) { return res.status(500).json(error.message); }
}

const backUpper = async (req: Request, res: Response) => {


    console.log(`getAllEntries requested`)
    try {
        const allEntries: MaskRequestType[] = [];
        const querySnapshot = await db.collection("maskrequests").get();
        querySnapshot.forEach((doc: any) => {

            let nextMaskRequest = doc.data();
            nextMaskRequest.id = doc.id;


            allEntries.push(nextMaskRequest);

        });

        fs.writeFile("masksrequest.json", JSON.stringify(allEntries), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

        //  fs.close();
        return res.status(200).json(allEntries);
    } catch (error) { return res.status(500).json(error.message); }




}

export { addEntry, getEntry, getAllEntries, updateEntry, deleteEntry, shippingProvider, backUpper, contributeEntry }

// async function mapDisplay(nextMaskRequest: any, id: any, arg2: string) {

//     try {
//         let displayView: any;
//         displayView.id = id;
//         displayView.name = nextMaskRequest.name;
//         displayView.quantity = nextMaskRequest.quantity;
//         displayView.createdAt = nextMaskRequest.createdAt;
//         displayView.status = nextMaskRequest.status;
//         displayView.city = nextMaskRequest.city;
//         return displayView;

//     } catch (error) { return "error"; }

// }

