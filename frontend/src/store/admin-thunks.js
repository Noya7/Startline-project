import { createAsyncThunk } from "@reduxjs/toolkit";

const DEFAULT_ERROR_MSG = "Ocurrio un error inesperado al intentar conectar con el servidor. por favor intenta de nuevo mas tarde."


export const createMedicAsync = createAsyncThunk('admin/create-medic', async (body) => {
    const response = await fetch(import.meta.env.VITE_API_URL + `/admin/code-generator`, {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body)
    })
    const data = await response.json()
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG)
    return data;
})