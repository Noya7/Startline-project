import { createMedicalReportAsync, editMedicalReportAsync } from "../../../store/medic-thunks";
import store from "../../../store/store";
import { bodyExtractor } from "../../auth/actions";

export const createReportAction = async ({request}) =>{
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(body.type === 'create' ? createMedicalReportAsync(body) : editMedicalReportAsync(body))
    console.log(data)
    return data;
}