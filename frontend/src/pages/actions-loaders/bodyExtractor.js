export const bodyExtractor = (formData) => {
    const body = {}
    for(const entry of formData.entries()) {
        const [key, value] = entry;
        body[key] = value;
    }
    return body;
}