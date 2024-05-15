import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import appointmentReducer from "./appointment-slice";
import patientReducer from "./patient-slice";
import medicReducer from "./medic-slice";

const store = configureStore({
   reducer: { auth: authReducer, appointments: appointmentReducer, patient: patientReducer, medic: medicReducer}
})

export default store;