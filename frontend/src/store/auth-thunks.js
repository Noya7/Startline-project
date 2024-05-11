import { createAsyncThunk } from "@reduxjs/toolkit";

const DEFAULT_ERROR_MSG = "Ocurrio un error inesperado al intentar conectar con el servidor. por favor intenta de nuevo mas tarde."

export const patientVerificationAsync = createAsyncThunk('auth/patient-verification', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/patient-availability', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(body),
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})

export const medicVerificationAsync = createAsyncThunk('auth/medic-verification', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/verify-code', {
        headers: {
            "token": body 
        },
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})

export const signupAsync = createAsyncThunk('auth/signup', async (credentials) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/signup', {
        method: 'POST',
        headers: {
            "usertype": credentials.get('userType')
        },
        body: credentials,
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    const cookie = response.headers.get('Cookie');
    return {data, cookie};
})

export const loginAsync = createAsyncThunk('auth/login', async (credentials) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
        method: 'POST',
        headers: {
            "usertype": credentials.userType,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    const cookie = response.headers.get('Cookie');
    return {data, cookie};
})

export const autoLoginAsync = createAsyncThunk('auth/autoLogin', async() => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/autoLogin', {credentials: 'include'});
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})

export const logoutAsync = createAsyncThunk('auth/logout', async() => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/logout', {credentials: 'include'});
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})

export const forgotPasswordAsync = createAsyncThunk('auth/forgotPassword', async (credentials) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/reset-mail', {
        method: 'POST',
        headers: {
            "usertype": credentials.userType,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})

export const resetTokenVerificationAsync = createAsyncThunk('auth/reset-verification', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/verify-reset-token', {
        headers: {
            "token": body 
        },
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})

export const resetPasswordAsync = createAsyncThunk('auth/resetPassword', async (credentials) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/reset-password', {
        method: 'POST',
        headers: {
            "token": credentials.token,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({password: credentials.password}),
        credentials: 'include'
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})

//TODO: SI HAY TIEMPO, REDUCIR ESTOS THUNKS, SON MUY PARECIDOS, PODRIA CREARSE UNA CLASE O UNA FUNCION
// QUE LOS CREE SEGUN PARAMETROS.