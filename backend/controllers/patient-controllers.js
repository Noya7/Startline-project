const PDFDoc = require('pdfkit')

const Patient = require('../models/patient')
const Appointment = require('../models/appointment');
const HttpError = require('../models/http-error');
const { uploadPDF } = require('../firebase/storageHandling');

//get appointments:

const getPatientAppointments = async (req, res, next) => {
    try {
        let { page } = req.query;
        const allAppointments = await Appointment.countDocuments({ existingPatient: req.userData.userId });
        const resultsPerPage = 12;
        const totalPages = Math.ceil(allAppointments / resultsPerPage);
        if (page < 1) page = 1;
        else if (page > totalPages) page = totalPages;
        const startIndex = (page - 1) * resultsPerPage;
        const requestedFields = '_id fullDate area medic existingReport review';

        const appointments = await Appointment.find({ existingPatient: req.userData.userId }).select(requestedFields)
        .populate({path: 'medic', select: ' -_id name surname image'})
        .skip(startIndex).limit(resultsPerPage);

        if (!appointments.length) {
            return res.status(404).json({ message: "No hay ninguna cita en el historial. Si crees que esto es un error, por favor contactate con administracion." });
        }

        return res.status(200).json({ totalPages, appointments });
    } catch (err) {
        return next(err);
    }
};

//get medical history:

const getMedicalHistory = async (req, res, next) => {
    try {
        const {userId} = req.userData;
        //obtenemos los datos necesarios para general la historia medica:
        const patient = await Patient.findById(userId, {name: 1, surname: 1, DNI: 1, birthDate: 1, appointments: 1, medicalHistory: 1})
        .populate({path: 'appointments', select: 'fullDate area medicalReport'})
        .populate({path: 'medicalHistory', select: '-patient -date -imageResults', populate: {
            path: 'medic',
            select: '-_id name surname'
        }});
        const appointments = patient.appointments;
        const medicalReports = patient.medicalHistory;

        //creacion de documento PDF:

        const doc = new PDFDoc({size: 'A4', margins:{top: 72, bottom: 72, left: 86, right: 86}, font: 'Times-Roman' })

        //header:
        const textWidth = doc.widthOfString('StartLine Clinic', { fontSize: 28 });

        doc.rect(0, 0, doc.page.width, 50).fill('#003066');
        doc.fontSize(28).fill('#ffffff').text('StartLine Clinic', doc.page.margins.left, doc.page.margins.top/4, { align: 'center'})
        .underline(doc.page.width/2 - 90, doc.page.margins.top/4, 180, 25, { color: '#990033' });
        doc.moveDown(4);
        
        //.fill('#990033')

        //title and legal note
        doc.font('Times-Bold', 18).fill('black').text('Historia Médica Confidencial', doc.page.margins.left, doc.page.margins.top, { align: 'center', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }).lineGap(5);
        doc.moveDown();
        doc.font('Times-Bold', 14).text('Este documento contiene información médica confidencial. Su divulgación o uso indebido está prohibido por la ley.', doc.page.margins.left, doc.page.margins.top + 18 + 10, { align: 'justify', width: doc.page.width - doc.page.margins.left - doc.page.margins.right });
        doc.moveDown();

        // Patient data:
        doc.font('Times-Bold', 14).text('Nombre de Paciente:', { underline: true, continued: true }).lineGap(10);
        doc.font('Times-Roman', 14).text(` ${patient.name} ${patient.surname}`, {underline: false});
        doc.font('Times-Bold', 14).text('DNI:', { underline: true, continued: true });
        doc.font('Times-Roman', 14).text(patient.DNI, {underline: false});
        doc.font('Times-Bold', 14).text('Fecha de nacimiento:', { underline: true, continued: true });
        doc.font('Times-Roman', 14).text(` ${patient.birthDate.toLocaleDateString()}`, {underline: false});
        doc.moveDown();

        //medical report iteration:
        medicalReports.forEach((report, index) => {
            doc.addPage();

            doc.rect(0, 0, doc.page.width, 50).fill('#003066');
            doc.fontSize(28).fill('#ffffff').text('StartLine Clinic', doc.page.margins.left, doc.page.margins.top/4, { align: 'center'})
            .underline(doc.page.width/2 - 90, doc.page.margins.top/4, 180, 25, { color: '#990033' });
            doc.moveDown(4);

            doc.font('Times-Roman',20).fill('black').text(`Informe Médico #${index + 1}`, doc.page.margins.left, doc.page.margins.top, {align:'center', underline: true })
            doc.moveDown();
            
            const appointment = appointments.find(appointment => appointment.medicalReport.toString() === report._id.toString());

            //appointment details:
            doc.font('Times-Bold', 14).text('Fecha:', { underline: true, continued: true }).lineGap(5);
            doc.font('Times-Roman', 14).text(` ${appointment.fullDate.toLocaleDateString()}`, {underline: false});
            doc.font('Times-Bold', 14).text('Área:', { underline: true, continued: true });
            doc.font('Times-Roman', 14).text(` ${appointment.area}`, {underline: false});
            doc.font('Times-Bold', 14).text('Médico:', { underline: true, continued: true });
            doc.font('Times-Roman', 14).text(` ${report.medic.name} ${report.medic.surname}`, {underline: false});
            doc.moveDown();

            //medical report details:
            doc.font('Times-Bold', 16).text('Motivo de consulta:', { underline: true });
            doc.font('Times-Roman', 14).text(report.motiveForConsultation);
            doc.moveDown();

            doc.font('Times-Bold', 16).text('Diagnóstico:', { underline: true });
            doc.font('Times-Roman', 14).text(report.diagnosis);
            doc.moveDown();

            doc.font('Times-Bold', 16).text('Tratamiento:', { underline: true });
            doc.font('Times-Roman', 14).text(report.treatment);
            doc.moveDown();
        })

        doc.end()

        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
        });
        const pdfURL = await uploadPDF(buffer, userId);
        return res.status(200).json(pdfURL)
    } catch (err) {
        console.log(err)
        return next(err);
    }
}

module.exports = {getPatientAppointments, getMedicalHistory}