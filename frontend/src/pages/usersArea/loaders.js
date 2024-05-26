import { redirect } from "react-router-dom";
import { autoLoginAsync } from "../../store/auth-thunks";
import store from "../../store/store"
import { getPatientAppointmentsAsync } from "../../store/patient-thunks";
import { getMedicAppointmentsAsync, getStatisticsAsync } from "../../store/medic-thunks";

export const patientLoader = async () =>{
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