import { createSlice } from "@reduxjs/toolkit";
import { getAreasAsync, getMedicsAsync, getUnavailableAsync } from "./appointments-thunks";

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: { areas: null, medics: null, unavailable: null },
    extraReducers: builder => {
        builder.addCase(getAreasAsync.fulfilled, (state, action) => {
            state.areas = action.payload;
        }),
        builder.addCase(getMedicsAsync.fulfilled, (state, action) => {
            console.log(action.payload)
            state.medics = action.payload;
        }),
        builder.addCase(getUnavailableAsync.fulfilled, (state, action) => {
            console.log(action.payload)
            state.unavailable = action.payload;
        })
    }
})

export default appointmentSlice.reducer;