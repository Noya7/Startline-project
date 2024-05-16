import {createSlice} from '@reduxjs/toolkit'
import { createMedicAsync } from './admin-thunks';

const adminSlice = createSlice({
    name: 'admin',
    initialState: { adminData: null },
    extraReducers: builder => {
        builder.addCase(createMedicAsync.fulfilled, () => {
            // console.log('Medic created')
        })
    }
})

export default adminSlice.reducer;