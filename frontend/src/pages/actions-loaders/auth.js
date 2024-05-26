import store from '../../store/store';
import {forgotPasswordAsync, loginAsync, patientVerificationAsync, resetPasswordAsync, signupAsync} from '../../store/auth-thunks'
import { autoLoginAsync, logoutAsync, medicVerificationAsync, resetTokenVerificationAsync } from "../../store/auth-thunks";
import { redirect } from 'react-router-dom';
import { bodyExtractor } from './bodyExtractor';

//actions:

export const PatientVerificationAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(patientVerificationAsync(body))
    if (data.error) return data;
    return redirect('/auth/signup/patient');
}

export const signupAction = async ({request}) => {
    const body = await request.formData();
    const data = await store.dispatch(signupAsync(body))
    if (data.error) return data;
    const state = store.getState().auth;
    return redirect('/portal/' + state.userData.userType)
}

export const loginAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(loginAsync(body));
    if (data.error) return data;
    const state = store.getState().auth;
    return redirect('/portal/' + state.userData.userType);
};

export const forgotPasswordAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(forgotPasswordAsync(body));
    return data;
};

export const resetPasswordAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(resetPasswordAsync(body));
    return data;
};

//loaders:

export const signupLoader = async ({params, request}) => {
    const {usertype} = params;
    if (!['admin', 'medic', 'patient'].includes(usertype)) return redirect(`/?err=Error:%20Tipo%20de%20usuario%20no%20válido`);
    switch (usertype) {
        case 'patient': {
            const state = store.getState();
            const signupData = state.auth.signupData;
            return signupData;
        }
        case'medic': {
            const url = new URL(request.url);
            const token = url.searchParams.get('token');
            if (!token) return redirect(`/?err=Error:%20Token%20no%20encontrado`);
            const data = await store.dispatch(medicVerificationAsync(token))
            if (data.error) return redirect(`/?err=${data.error.message}`);
            return data.payload;
        }
        default: return null;
    }
}

export const resetPasswordLoader = async ({request}) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return redirect(`/?err=Error:%20Token%20no%20encontrado`);
    const data = await store.dispatch(resetTokenVerificationAsync(token))
    if (data.error) return redirect(`/?err=${data.error.message}`);
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