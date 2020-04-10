
export const parseError = e => {
    if (e.response && e.response.data) {
        return e.response.data;
    }

    return e;
}
