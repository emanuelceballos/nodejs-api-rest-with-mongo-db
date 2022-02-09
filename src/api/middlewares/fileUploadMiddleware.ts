import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import aws from "aws-sdk";
import config from "config";

aws.config.update({
    accessKeyId: config.get('aws.accessKey'),
    secretAccessKey: config.get('aws.secretKey'),
    region: config.get('aws.region')
});

const s3 = new aws.S3();

export const handleFileLocal = (request: Request): Promise<any> => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads');
        },
        filename: function (req, file, cb) {
            const extension: string = getExtension(file.originalname);
            const fileNameWithoutExtension = file.originalname.replace(extension, '');
            const fileName = `${fileNameWithoutExtension} - ${Date.now()}${extension}`;

            cb(null, fileName);
        }
    })

    const multerSingle = multer({ storage }).single("file");

    return new Promise((resolve, reject) => {
        multerSingle(request, null as any, async (error) => {

            if (error) {
                reject(error);
            }

            resolve("File uploaded successfully");
        });
    });
}

// Requires multer-s3
export const handleFileS3 = (request: Request): Promise<any> => {

    var storage = multerS3({
        s3,
        bucket: config.get('aws.s3.bucket'),
        key: function (req, file, cb) {
            const extension: string = getExtension(file.originalname);
            const fileNameWithoutExtension = file.originalname.replace(extension, '');
            const fileName = `${fileNameWithoutExtension} - ${Date.now()}${extension}`;

            cb(null, fileName);
        }
    })

    const multerArray = multer({ storage }).array("file");

    return new Promise((resolve, reject) => {
        multerArray(request, null as any, async (error) => {

            if (error) {
                reject(error);
            }

            resolve("File uploaded successfully");
        });
    });
}

const getExtension = (fileName: string): string => {
    return path.extname(fileName);
}