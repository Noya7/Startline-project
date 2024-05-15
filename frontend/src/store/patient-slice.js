import { createSlice } from "@reduxjs/toolkit";
import { getPatientAppointmentsAsync } from "./patient-thunks";

const patientSlice = createSlice({
    name: 'patient',
    initialState: { appointments: null },
    extraReducers: builder => {
        builder.addCase(getPatientAppointmentsAsync.fulfilled, (state, action) => {
            state.appointments = action.payload;
        })
    }
})

export default patientSlice.reducer;
