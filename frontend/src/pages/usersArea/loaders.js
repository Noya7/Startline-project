import { redirect } from "react-router-dom";
import { autoLoginAsync } from "../../store/auth-thunks";
import store from "../../store/store"
import { getPatientAppointmentsAsync } from "../../store/patient-thunks";
import { getMedicAppointmentsAsync } from "../../store/medic-thunks";

export const portalLoader = async ({request}) =>{
    const state = store.getState();
    let data = state.auth.userData;
    if (!data) {
        data = await store.dispatch(autoLoginAsync());
        if (data.type === 'auth/autoLogin/rejected') return redirect('/auth/login');
        return redirect(data.payload.userType)
    }
    const url = new URL(request.url)
    if(url.pathname === '/portal'){
        return redirect(data.userType)
    }
    return null
}

export const patientLoader = async () =>{
    const state = store.getState();
    let userData = state.auth.userData;
    if (!userData) {
        const autoLoginData = await store.dispatch(autoLoginAsync());
        if (autoLoginData.type === 'auth/autoLogin/rejected') return redirect('/auth/login');
        userData = autoLoginData.payload;
    }

    const appointmentData = await store.dispatch(userData.userType === 'medic' ?
    getMedicAppointmentsAsync(new Date()) :
    getPatientAppointmentsAsync(1)
    )
    if (appointmentData.type === 'patients/get-appointments/rejected') return null;
    return appointmentData
}