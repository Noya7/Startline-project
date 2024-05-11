import { redirect } from "react-router-dom";
import store from "../../store/store"
import { medicVerificationAsync, resetTokenVerificationAsync } from "../../store/auth-thunks";

export const signupLoader = async ({params, request}) => {
    const {usertype} = params;
    if (!['admin', 'medic', 'patient'].includes(usertype)) return redirect('/');
    switch (usertype) {
        case 'patient': {
            const state = store.getState();
            const signupData = state.auth.signupData;
            return signupData;
        }
        case'medic': {
            const url = new URL(request.url);
            const token = url.searchParams.get('token');
            if (!token) return redirect('/');
            const data = await store.dispatch(medicVerificationAsync(token))
            if (data.error) return redirect('/');
            return data.payload;
        }
        default: return null;
    }
}

export const resetPasswordLoader = async ({request}) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return redirect('/');
    const data = await store.dispatch(resetTokenVerificationAsync(token))
    if (data.error) return redirect('/');
    const resetData = {token: data.meta.arg, userData: data.payload.existingUser, userType: data.payload.usertype}
    return resetData;
}

// const portalLoader = () => {
    //ver si hay un cookie. si no hay, redirigir a login.
    //enviar cookie en solicitud de autologin
    //si es valido, iniciar sesion y redirigir a portal correspondiente.
    //si es invalido, redirigir a login.
// }