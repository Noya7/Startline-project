import { redirect } from "react-router-dom";
import store from "../../store/store"
import { autoLoginAsync, logoutAsync, medicVerificationAsync, resetTokenVerificationAsync } from "../../store/auth-thunks";

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

export const loginLoader = async () => {
    const data = await store.dispatch(autoLoginAsync())
    if(data.type === 'auth/autoLogin/rejected') return null;
    const state = store.getState().auth;
    return redirect('/portal/' + state.userData.userType)
}

export const logoutLoader = async () => {
    const data = await store.dispatch(logoutAsync())
    if(data.type === 'auth/logout/rejected') return null;
    return redirect('/')
}