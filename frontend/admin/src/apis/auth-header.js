export const authHeader = () => {
    let token = localStorage.get('user-token');

    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    } else {
        return {};
    }
};