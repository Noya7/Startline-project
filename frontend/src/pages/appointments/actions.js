import { createAppointmentAsync } from "../../store/appointments-thunks";
import store from "../../store/store";
import { bodyExtractor } from "../auth/actions";

export const newAppointmentAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(createAppointmentAsync(body));
    return data;
};