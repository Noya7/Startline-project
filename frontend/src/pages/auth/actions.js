import store from '../../store/store';
import {forgotPasswordAsync, loginAsync, patientVerificationAsync, resetPasswordAsync, signupAsync} from '../../store/auth-thunks'
import { redirect } from 'react-router-dom';

export const bodyExtractor = (formData) => {
    const body = {}
    for(const entry of formData.entries()) {
        const [key, value] = entry;
        body[key] = value;
    }
    return body;
}

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