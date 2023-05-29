import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "DELETE") return res.status(405).end();

    // get params
    const { id } = req.query

    // get old data
    const data = require('../../../public/kecelakaan.json');

    // set new data
    const newData = {
        ...(data),
        features: data.features.filter((feature: any) => (feature?.properties?.id != id))
    };

    // sync data
    fs.writeFile('./public/kecelakaan.json', JSON.stringify(newData), err => {
        if (err) throw err;
    });

    // repsonse
    res.status(200).json({
        message: "Success"
    });
}