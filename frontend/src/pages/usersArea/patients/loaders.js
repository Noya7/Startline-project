import store from "../../../store/store"
import { getPatientReportAsync } from "../../../store/patient-thunks";

export const patientReportLoader = async ({params}) => {
    const id = params.id
    const data = await store.dispatch(getPatientReportAsync(id))
    return {rep: data.payload}
}