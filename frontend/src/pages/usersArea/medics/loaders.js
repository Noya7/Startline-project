import { redirect } from "react-router-dom";
import store from "../../../store/store"
import { getReportAsync } from "../../../store/medic-thunks";

export const reportsLoader = ({params}) => {
    const id = params.id
    const state = store.getState().medic.appointments
    const appointment = state.find((obj) => obj._id === id);
    if (!appointment) return redirect('/portal/medic/appointments');
    let data;
    if (appointment.medicalReport) {
        data = store.dispatch(getReportAsync(appointment.medicalReport));
        return {rep: data};
    }
    return {app: [appointment._id, appointment.DNI, appointment.existingPatient]}
}