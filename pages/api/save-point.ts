import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    // if (req.method != "POST") {
        return res.status(400).json({
            message: 'Just allow method POST',
            currentMethod: req.method
        });
    // }

    // get body req
    const { incicdent } = req.body;

    // get old data
    const data = require('../../public/kecelakaan.json');

    // filter old data
    const newFeatures = data.features.filter((feature: any) => (feature?.properties?.id != incicdent?.properties?.id));

    // add new data
    const newData = {
        ...(data),
        features: [
            ...(newFeatures),
            incicdent
        ]
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