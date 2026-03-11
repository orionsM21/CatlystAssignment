import createApiClient from "../common/hooks/apiClient";



const api = createApiClient('gold'); // module name

export const getAllUsers = () => {
    return api.get('getAllUsers'); // BASE_URL + users
};

export const getAllRoles = () => {
    return api.get('getAllRoles'); // BASE_URL + users
};
