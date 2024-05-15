import { createAsyncThunk } from "@reduxjs/toolkit";

const DEFAULT_ERROR_MSG = "Ocurrio un error inesperado al intentar conectar con el servidor. por favor intenta de nuevo mas tarde."

export const getPatientAppointmentsAsync = createAsyncThunk('patients/get-appointments', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + `/patient/appointments?page=${body}`, {
        credentials: 'include'
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})

export const getUnavailableAsync = createAsyncThunk('appointments/get-unavailable', async (selection) => {
    const body = JSON.stringify({
        date: selection.selectedDate,
        medic: selection.selectedDoctor
    })

    const response = await fetch(import.meta.env.VITE_API_URL + `/patient/unavailable-appointments`, {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        method: 'POST',
        body
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})