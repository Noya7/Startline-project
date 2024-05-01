const {storage} = require('./firebase')
const {v4} = require('uuid');
const HttpError = require('../models/http-error')

//profile image upload, takes an image for argument and uploads it.

const profileImageUpload = async (file, userId) => {
    try {
        if (!file) throw new HttpError('No se proporcionó ningún archivo.', 400);
        
        const bucket = storage.bucket();
        const image = bucket.file(`profile_pictures/${userId}/${v4()}`);
        const stream = image.createWriteStream({ metadata: { contentType: file.mimetype } });
        
        return new Promise((resolve, reject) => {
          stream.on('error', err => {
            reject(new HttpError('Ocurrió un error inesperado al subir la imagen. Error: ' + err.message, 500));
          });
        
          let url;
          stream.on('finish', async () => {
            await image.makePublic();
            url = `https://storage.googleapis.com/${bucket.name}/${image.name}`;
            resolve(url);
          });
        
          stream.end(file.buffer);
        });
    } catch (err) {
      return new HttpError('Ocurrió un error inesperado al subir la imagen. Error: ' + err.message, 500);
    }
};

const deleteImages = async (folderPath) => {
    try {
        // Obtener lista de archivos en la carpeta:
        const [files] = await storage.bucket().getFiles({prefix: folderPath});
        // Iterar y eliminar:
        await Promise.all(files.map( async file => await file.delete() ));
    } catch (err) {
        return err;
    }
};

const uploadPDF = async (buffer, userId) =>{
  try {
    const bucket = storage.bucket();
    const file = bucket.file(`medical_history/${userId}/${v4()}.pdf`);
    const stream = file.createWriteStream({metadata: {contentType: 'application/pdf'}});

    return new Promise((resolve, reject) => {
      stream.on('error', err => reject(new HttpError("Ocurrio un error inesperado al cargar el PDF. Error: " + err.message, 500)))
      stream.on('finish', async () => {
        await file.makePublic();
        const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        resolve(url);
      })
      stream.end(buffer)
    })
  } catch (err) {
    return new HttpError(`Ocurrio un error inesperado al cargar el PDF. Error: ${err.message}`, 500)
  }
}

module.exports = {profileImageUpload, deleteImages, uploadPDF}