import store from "../../../store/store"
import { getPatientReportAsync } from "../../../store/patient-thunks";

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