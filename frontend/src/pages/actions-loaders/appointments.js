import { createAppointmentAsync, getAreasAsync } from "../../store/appointments-thunks";
import store from "../../store/store";
import { bodyExtractor } from "./bodyExtractor";

//actions:

export const newAppointmentAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(createAppointmentAsync(body));
    return data;
};

//loaders:

export const newAppointmentLoader = async () => {
    const data = await store.dispatch(getAreasAsync())
    if(data.type === 'appointments/get-areas/rejected') return null;
    return data.payload
}