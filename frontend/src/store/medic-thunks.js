import { createAsyncThunk } from "@reduxjs/toolkit";

const DEFAULT_ERROR_MSG = "Ocurrio un error inesperado al intentar conectar con el servidor. por favor intenta de nuevo mas tarde."

export const getMedicAppointmentsAsync = createAsyncThunk('medic/get-appointments', async (date) => {
    const response = await fetch(import.meta.env.VITE_API_URL + `/medic/appointments?date=${date}`, {
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})

export const createMedicalReportAsync = createAsyncThunk('medic/create-report', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/medic/create-report', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(body),
        credentials: 'include'
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})

export const getReportAsync = createAsyncThunk('medic/get-report', async (reportId) => {
    const response = await fetch(import.meta.env.VITE_API_URL + `/medic/get-report?reportId=${reportId}`, {
        credentials: 'include'
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})

export const editMedicalReportAsync = createAsyncThunk('medic/edit-report', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + '/medic/edit-report', {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(body),
        credentials: 'include'
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
})