import { createSlice } from "@reduxjs/toolkit";
import { deleteAppointmentsAsync, getPatientAppointmentsAsync, getPatientReportAsync } from "./patient-thunks";

const patientSlice = createSlice({
    name: 'patient',
    initialState: { appointments: null, report: null },
    extraReducers: builder => {
        builder.addCase(getPatientAppointmentsAsync.fulfilled, (state, action) => {
            state.appointments = action.payload;
        }),
        builder.addCase(getPatientReportAsync.fulfilled, (state, action) => {
            state.report = action.payload;
        }),
        builder.addCase(deleteAppointmentsAsync.fulfilled, (state, action) => {
            state.appointments = state.appointments.filter(appointment => appointment._id !== action.payload._id)
        })
    }
})

export default patientSlice.reducer;
