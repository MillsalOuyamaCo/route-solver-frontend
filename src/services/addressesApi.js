import axios from 'axios';

const addressesApi = axios.create({
    baseURL: 'https://viacep.com.br/'
});

export default addressesApi;