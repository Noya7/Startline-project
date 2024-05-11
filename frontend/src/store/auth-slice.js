import {createSlice} from '@reduxjs/toolkit'
import { autoLoginAsync, loginAsync, logoutAsync, patientVerificationAsync, medicVerificationAsync, signupAsync } from './auth-thunks';

const authSlice = createSlice({
    name: 'auth',
    initialState: { userData: null, signupData: null, resetData: null},
    extraReducers: builder => {
        builder.addCase(loginAsync.fulfilled, (state, action) => {
            state.userData = action.payload.data.userData;
        }),
        builder.addCase(autoLoginAsync.fulfilled, (state, action) => {
            state.userData = action.payload
        }),
        builder.addCase(logoutAsync.fulfilled, (state) => {
            state.userData = null;
            console.log('logged out');
        }),
        builder.addCase(patientVerificationAsync.fulfilled, (state, action) => {
            state.signupData = action.payload;
        }),
        builder.addCase(medicVerificationAsync.fulfilled, (state, action) => {
            state.signupData = action.payload;
        }),
        builder.addCase(signupAsync.fulfilled, (state, action) => {
            state.userData = action.payload.data.userData;
            state.signupData = null;
        })
    }
})

export default authSlice.reducer;