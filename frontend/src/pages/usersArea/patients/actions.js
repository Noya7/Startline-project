import { bodyExtractor } from "../../auth/actions";
import store from "../../../store/store";
import { createReviewAsync } from "../../../store/patient-thunks";

export const createReviewAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(createReviewAsync(body));
    return data;
}