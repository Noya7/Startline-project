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
    if (data.error) return data.error.message;
    return redirect('/auth/signup/patient');
}

export const signupAction = async ({request}) => {
    const body = await request.formData();
    const data = await store.dispatch(signupAsync(body))
    if (data.error) return data.error.message;
    return redirect('/')
}

export const loginAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(loginAsync(body));
    if (data.error) return data.error.message;
    return redirect('/');
};

export const forgotPasswordAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(forgotPasswordAsync(body));
    if (data.error) return data.error;
    return data.payload;
};

export const resetPasswordAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(resetPasswordAsync(body));
    if (data.error) return data.error;
    return data.payload;
};