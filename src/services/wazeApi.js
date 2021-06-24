import axios from 'axios';

const wazeApi = axios.create({
    baseURL: 'https://waze.com/ul'
});

export default wazeApi;