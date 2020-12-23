import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_API;
const routeSolverApis = axios.create({
    // baseURL: 'https://localhost:5001/api/v1'
    baseURL: apiUrl
});

export default routeSolverApis;