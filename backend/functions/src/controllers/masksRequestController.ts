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

const getAllEntriesV1 = async (req: Request, res: Response) => {
    console.log(`getAllEntries requested`)
    try {
        const allEntries: MaskRequestType[] = [];

        const requestsDbCollection = ((req.headers['env'] && req.headers['env'] === 'testenv'))
            ? db.collection(TEST_MASK_REQUESTS_COLLECTION)
            : db.collection(MASK_REQUESTS_COLLECTION);

        const querySnapshot = await requestsDbCollection.get();
        await querySnapshot.forEach(async (doc: any) => {

            console.log("processing next request item");

            let nextMaskRequest = doc.data();

            const contribDbCollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ?
                requestsDbCollection.doc(doc.id).collection(TEST_CONTRIBUTER_COLLECTION)
                : requestsDbCollection.doc(doc.id).collection(MASK_REQUESTS_COLLECTION);
            const contribDbCollectionDocs = await contribDbCollection.get();

            let contributions: any = []

            if (!contribDbCollectionDocs.empty) {
                contribDbCollectionDocs.forEach(async (contribDbCollectionDoc: any) => {

                    let contributerDoc = contribDbCollectionDoc.data();
                    let contributeDocData: any = {};
                    contributeDocData.name = contributerDoc.name;
                    if (contributerDoc.comments)
                        contributeDocData.comments = contributerDoc.comments;
                    contributeDocData.comments = contributerDoc.createdAt;
                    contributeDocData.id = contribDbCollectionDoc.id;
                    contributions.push(contributeDocData)
                });

            }
            //  let displayResponse = await mapDisplay(nextMaskRequest, doc.id, "public")
            //nextMaskRequest.id = doc.id;

            let displayView: any = {};
            displayView.id = doc.id;
            displayView.name = nextMaskRequest.name;
            displayView.quantity = nextMaskRequest.quantity;
            displayView.createdAt = nextMaskRequest.createdAt;
            displayView.status = nextMaskRequest.status;
            displayView.city = nextMaskRequest.city;
            //  displayView.contributions = contributions;
            allEntries.push(displayView);

        });

        console.log("returning finalyy");

        return res.status(200).json(allEntries);
    } catch (error) { return res.status(500).json(error.message); }
}


const getAllEntries = async (req: Request, res: Response) => {

    console.log(`getAllEntries new requested`)
    try {
        const allEntries: any[] = [];

        const requestsDbCollection = ((req.headers['env'] && req.headers['env'] === 'testenv'))
            ? db.collection(TEST_MASK_REQUESTS_COLLECTION)
            : db.collection(MASK_REQUESTS_COLLECTION);

        const querySnapshot = await requestsDbCollection.get();
        var tempCollection: any = [];
        querySnapshot.forEach(nextReqDoc => {
            const reqData: any = nextReqDoc.data();
            reqData.id = nextReqDoc.id;
            tempCollection.push(reqData);
        });

        for (const collection of tempCollection) {
            // var temp = {};
            var nextRequest = await getRequestDetails(collection.id, 'min', req.headers['env']);
            allEntries.push(nextRequest)
        }
        return res.status(200).json(allEntries);

    } catch (error) { return res.status(500).json(error.message); }

}

// const getConributions = async(req:Reques,res:Response) => {

// }

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
        const requestDoc = ((req.headers['env'] && req.headers['env'] === 'testenv')) ?
            db.collection(TEST_MASK_REQUESTS_COLLECTION)
                .doc(req.params.maskRequestId)
            // .collection(TEST_CONTRIBUTER_COLLECTION) 
            : db.collection(MASK_REQUESTS_COLLECTION)
                .doc(req.params.maskRequestId)
        //  .collection(CONTRIBUTER_COLLECTION);

        const contribdbcollection = ((req.headers['env'] && req.headers['env'] === 'testenv')) ?
            requestDoc.collection(TEST_CONTRIBUTER_COLLECTION)
            : requestDoc.collection(CONTRIBUTER_COLLECTION);

        const newContributeRequest = {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            comments: req.body.comments,
            createdAt: firestore.FieldValue.serverTimestamp()
        }
        const newContributeRequestDoc = contribdbcollection.doc(contributeRequestId);
        await newContributeRequestDoc.set(newContributeRequest).catch(error => {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        });
        await requestDoc.update({ status: 'need more help' });
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

export { addEntry, getEntry, getAllEntries, updateEntry, deleteEntry, shippingProvider, backUpper, contributeEntry, getAllEntriesV1 }


async function getRequestDetails(id: any, level: string, env: string) {

    console.log(`getRequestDetails : maskRequestId ${id}`)

    const requestsDbCollection = (env === 'testenv') ? db.collection(TEST_MASK_REQUESTS_COLLECTION) : db.collection(MASK_REQUESTS_COLLECTION);

    const entry = await requestsDbCollection.doc(id);
    //  console.log("i am here")
    const docData = await entry.get();
    let currentData: any = await docData.data();

    //  console.log("nnn", currentData)
    if (currentData) {

        currentData.id = docData.id;

        if (currentData.createdAt) {

            //  console.log("converting createdAt ")
            currentData.createdAt = new Date(currentData.createdAt._seconds * 1000)

            //  console.log(currentData.createdAt)
        } else {

            console.log("currentData.createdAt does not exist  ", currentData)
        }

        const contributeDocCollection = (env === 'testenv') ? requestsDbCollection
            .doc(docData.id).collection(TEST_CONTRIBUTER_COLLECTION)
            : requestsDbCollection.doc(docData.id).collection(CONTRIBUTER_COLLECTION);

        // const requestsDbCollection =  (env === 'testenv') ? db.collection(TEST_CONTRIBUTER_COLLECTION) : db.collection(CONTRIBUTER_COLLECTION);
        const querySnapshot = await contributeDocCollection.get();
        //  var tempContribCollection: any = [];
        let contribData: any = [];
        if (!querySnapshot.empty) {
            console.log(" contributions found");
            querySnapshot.forEach(nextContribDoc => {
              //  console.log(" getting contrib partially");
                let contribDocData: any = nextContribDoc.data();
                contribDocData.id = contribDocData.id;
                if (contribDocData.createdAt) {
                    //   console.log("converting contrinute createdAt ")
                    contribDocData.createdAt = new Date(contribDocData.createdAt._seconds * 1000)
                    //console.log(currentData.createdAt)
                }

                if (level === 'min') {
                    let tempData: any = {}

                    tempData.id = contribDocData.id;
                    tempData.name = contribDocData.name;
                    tempData.createdAt = contribDocData.createdAt;
                    tempData.comments = contribDocData.comments;
                    contribDocData = tempData;
                }
                contribData.push(contribDocData);
            });
           // console.log(" getting contrib done");
            currentData.contributions = contribData;
        }

        if (level === 'min') {

            let displayView: any = {}
            displayView.id = currentData.id;
            displayView.name = currentData.name;
            displayView.quantity = currentData.quantity;
            displayView.createdAt = currentData.createdAt;
            displayView.status = currentData.status;
            displayView.city = currentData.city;
            if (currentData.contributions)
                displayView.contributions = currentData.contributions;
            currentData = displayView


        }
        return currentData;
    }
    else {
        throw new Error("request not found for id." + id);
    }
}


// async function getContribDetails(contributeDocCollection: firestore.CollectionReference<firestore.DocumentData>, id: any, env: string) {
//     console.log(`getContribDetails : contribId ${id}`)
//     const contributeDoc = contributeDocCollection.doc(id);
//     //  console.log("i am here")
//     const docData = await contributeDoc.get();
//     let currentData: any = await docData.data();
//     if (currentData) {
//         currentData.id = docData.id;
//         console.log("currentData.createdAt",currentData.createdAt)
//         if (currentData.createdAt) {
//             console.log("converting contrinute createdAt ")
//             currentData.createdAt = new Date(currentData.createdAt._seconds * 1000)
//              console.log(currentData.createdAt)
//         } else {

//             console.log("currentData.createdAt does not exist  ", currentData)
//         }

//         console.log(currentData)
//         return currentData;

//     } else
//         throw new Error("Contribute Doc not Found");
// }
// // async function mapDisplay(nextMaskRequest: any, id: any, arg2: string) {

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

