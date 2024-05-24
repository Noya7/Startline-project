import { redirect } from "react-router-dom";
import store from "../../../store/store"
import { getReportAsync } from "../../../store/medic-thunks";

export const reportsLoader = async ({params}) => {
    const id = params.id
    const state = store.getState().medic.appointments
    const appointment = state.find(obj => obj._id === id);
    if (!appointment) return redirect('/portal/medic/appointments');
    if (appointment.medicalReport) {
        const data = await store.dispatch(getReportAsync(appointment.medicalReport));
        return {rep: data.payload};
    }
    return {app: [appointment._id, appointment.DNI, appointment.existingPatient]}
}