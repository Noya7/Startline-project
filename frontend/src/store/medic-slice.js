import { createSlice } from "@reduxjs/toolkit";
import { editMedicalReportAsync, getMedicAppointmentsAsync, getReportAsync } from "./medic-thunks";

const medicSlice = createSlice({
    name: 'medic',
    initialState: { appointments: null, report: null },
    extraReducers: builder => {
        builder.addCase(getMedicAppointmentsAsync.fulfilled, (state, action) => {
            state.appointments = action.payload;
        }),
        builder.addCase(getReportAsync.fulfilled, (state, action) => {
            console.log(action.payload);
            state.report = action.payload;
        })
        builder.addCase(editMedicalReportAsync.fulfilled, (state) => {
            state.report = null
        })
    }
})

export default medicSlice.reducer;