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

    async isObjectExists(name)
    {
        const Params = {
            Bucket: bucketName
        }

        const data = await s3.listObjectsV2(Params).promise();

        console.log(name)

        const results = [];

        const nameWithoutType = name.replace('.mp4','').split('_');

        for (let i = 0; i < data['Contents'].length; i++)
        {
            const result = data['Contents'][i]['Key'].replace('.mp4','').split('_');
            if(result[0] === nameWithoutType[0])
                results.push(result)
        }

        console.log(results.length)
        if(results.length === 0)
        {
            const returningValue = nameWithoutType[0] + "_1.mp4";
            return returningValue;
        }
        else
        {
            const lastElemId = parseInt(results[results.length - 1][1]);
            const returningValue = `${nameWithoutType[0]}_${lastElemId + 1}.mp4`;
            return returningValue;
        }
    }

    async update(file, oldFile)
    {
        return await this.removeFile(oldFile).then(async (res) => {
            return await this.upload(file).then(res=>{
                return res;
            });
        })
    }

    async upload(file)
    {
        const fileStream = fs.createReadStream(file.path);

        const name = await this.isObjectExists(file.originalFilename);

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: name
        }

        return s3.upload(uploadParams).promise();
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