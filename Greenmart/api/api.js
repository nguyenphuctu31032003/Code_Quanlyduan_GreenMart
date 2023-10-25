import axios from 'axios';
// import {IP} from '@env'
const IP = '192.168.40.105'
const api = axios.create({
    baseURL: `http://${IP}:4848/users`,
});

export const registerUser = (phone, password,identifier,address,role,name) => {
    return api.post('/register', { phone, password,identifier,address,role,name});
};

export const loginUser = (phone, password) => {
    return api.post('/login', { phone, password });
};
