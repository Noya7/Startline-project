import { createSlice } from "@reduxjs/toolkit";
import { getMedicAppointmentsAsync } from "./medic-thunks";

const medicSlice = createSlice({
    name: 'medic',
    initialState: { appointments: null },
    extraReducers: builder => {
        builder.addCase(getMedicAppointmentsAsync.fulfilled, (state, action) => {
            state.appointments = action.payload;
        })
    }
})

export default medicSlice.reducer;