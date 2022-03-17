import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js'
import {Readable} from "stream";

const bucketName = process.env.BUCKET_AWS_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

class S3Service {
    async upload(file)
    {
        console.log(file)
        const fileStream = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.originalFilename
        }

        return s3.upload(uploadParams).promise()
    }

    async getFile(fileKey) {
        const downloadParams = {
            Key: fileKey,
            Bucket: bucketName
        }

        return s3.getObject(downloadParams).createReadStream();
    }

    async removeFile(fileKey)
    {
        const removeParams = {
            Key: fileKey,
            Bucket: bucketName
        }

        return s3.deleteObject(removeParams).promise()
    }
}

export default new S3Service();