const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authCodeSchema = new Schema({
    code: {type: String, required: true},
    matricula: {type: Number, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true},
    expires: {type: Date, required: true}
})

module.exports = new mongoose.model("AuthCode", authCodeSchema);