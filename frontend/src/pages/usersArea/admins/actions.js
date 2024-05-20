import { createMedicAsync } from "../../../store/admin-thunks";
import store from "../../../store/store";
import { bodyExtractor } from "../../auth/actions";

export const createMedicAction = async ({request}) =>{
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(createMedicAsync(body))
    return data;
}