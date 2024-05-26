import { createSlice } from "@reduxjs/toolkit";
import { editMedicalReportAsync, getMedicAppointmentsAsync, getReportAsync, getStatisticsAsync } from "./medic-thunks";

const medicSlice = createSlice({
    name: 'medic',
    initialState: { appointments: null, report: null, statistics: null},
    extraReducers: builder => {
        builder.addCase(getMedicAppointmentsAsync.fulfilled, (state, action) => {
            state.appointments = action.payload;
        }),
        builder.addCase(getReportAsync.fulfilled, (state, action) => {
            state.report = action.payload;
        })
        builder.addCase(editMedicalReportAsync.fulfilled, (state) => {
            state.report = null
        }),
        builder.addCase(getStatisticsAsync.fulfilled, (state, action) => {
            state.statistics = action.payload;
        })
    }
})

export default medicSlice.reducer;