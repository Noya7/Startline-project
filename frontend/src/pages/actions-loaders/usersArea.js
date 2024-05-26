import { redirect } from "react-router-dom";
import { createMedicAsync } from "../../store/admin-thunks";
import { createMedicalReportAsync, editMedicalReportAsync, getMedicAppointmentsAsync, getReportAsync, getStatisticsAsync } from "../../store/medic-thunks";
import { createReviewAsync, getPatientAppointmentsAsync, getPatientReportAsync } from "../../store/patient-thunks";
import { autoLoginAsync } from "../../store/auth-thunks";
import store from "../../store/store";
import { bodyExtractor } from "./bodyExtractor";

//actions:

//admin:

export const createMedicAction = async ({request}) =>{
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(createMedicAsync(body))
    return data;
}

//medic:

export const createReportAction = async ({request}) =>{
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(body.type === 'create' ? createMedicalReportAsync(body) : editMedicalReportAsync(body))
    return data;
}

//patient:

export const createReviewAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(createReviewAsync(body));
    return data;
}

//loaders:

//portal loader:

export const portalLoader = async () =>{
    const state = store.getState();
    let userData = state.auth.userData;
    if (!userData) {
        const autoLoginData = await store.dispatch(autoLoginAsync());
        if (autoLoginData.type === 'auth/autoLogin/rejected') return redirect('/auth/login');
        userData = autoLoginData.payload;
    }
    switch (userData.userType) {
        case 'medic': {
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            await store.dispatch(getMedicAppointmentsAsync(formattedDate));
            await store.dispatch(getStatisticsAsync())
            break;
        }
        case 'patient': await store.dispatch(getPatientAppointmentsAsync(1)); break;
        default : break;
    }
    return null
}

//medic:

export const reportsLoader = async ({params}) => {
    const {type, id} = params;
    if (!['edit', 'create'].includes(type)) return redirect('/portal/medic/appointments');
    if (type === 'edit') {
        const data = await store.dispatch(getReportAsync(id));
        return {rep: data.payload};
    }
    let appointment;
    const state = store.getState().medic.appointments;
    appointment = state?.find(obj => obj._id === id);
    if (!appointment){
        appointment = JSON.parse(localStorage.getItem('appointment'));
        if (!appointment) return redirect('/portal/medic/appointments');
    }
    localStorage.setItem('appointment', JSON.stringify(appointment));
    return {app: [appointment._id, appointment.DNI, appointment.existingPatient]}
}

//patient:

export const patientReportLoader = async ({params}) => {
    const {id} = params;
    let data = JSON.parse(localStorage.getItem('appointment'));
    if (!data || data._id !== id){
        data = await store.dispatch(getPatientReportAsync(id));
        data = data.payload;
    }
    localStorage.setItem('appointment', JSON.stringify(data));
    return {rep: data}
}

export const reviewLoader = async ({params, request}) => {
    const {id} = params;
    const url = new URL(request.url)
    const medicId = url.searchParams.get('med');
    return {medicId, appId: id};
}