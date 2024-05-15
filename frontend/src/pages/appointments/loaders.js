import { getAreasAsync } from "../../store/appointments-thunks";
import store from "../../store/store";

export const newAppointmentLoader = async () => {
    const data = await store.dispatch(getAreasAsync())
    if(data.type === 'appointments/get-areas/rejected') return null;
    return data.payload
}