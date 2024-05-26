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

export const reviewLoader = async ({params, request}) => {
    const {id} = params;
    const url = new URL(request.url)
    const medicId = url.searchParams.get('med');
    return {medicId, appId: id};
}