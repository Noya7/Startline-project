import { redirect } from "react-router-dom";
import store from "../../../store/store"
import { getReportAsync } from "../../../store/medic-thunks";

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