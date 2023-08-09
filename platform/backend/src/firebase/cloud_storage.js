const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const path = require('path');
const fs = require('fs')
/*const { STORAGE_PROJECT_ID, STORAGE_BUCKET_URL } = require('../config/firebase.config');

const keyPath = path.join(__dirname, 'serviceAccountKey.json')
console.log(`Cloud Storage key path -> ${keyPath}`);

if (!fs.existsSync(keyPath)) {
    throw Error("You must provide Cloud Storage key file");
}
*/
/**
 * Subir el archivo a Firebase Storage
 * file objeto que sera almacenado en Firebase Storage
 */
module.exports = (file, pathImage) => {
    return new Promise((resolve, reject) => {
        
        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {
                const storage = new Storage({
                    projectId: STORAGE_PROJECT_ID,
                    keyFilename: keyPath
                });
                const bucket = storage.bucket(STORAGE_BUCKET_URL);
                let fileUpload = bucket.file(`${pathImage}`);
                const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                });

                blobStream.on('error', (error) => {
                    console.log('Something is wrong! Unable to upload at the moment', error);
                    reject('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', () => {
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    console.log('Cloud Storage URL ', url);
                    resolve(url);
                });

                blobStream.end(file.buffer);
            }
        }
    });
}