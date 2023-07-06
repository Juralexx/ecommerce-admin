import axios from 'axios';

//Default root path of all the axios requests
axios.defaults.baseURL = process.env.SERVER_URL;
//Api key / 'Authorization' header
axios.defaults.headers.common['Authorization'] = process.env.API_KEY;
//Header to define if the request come from the dashboard or site
axios.defaults.headers.common['AuthType'] = 'user';
axios.defaults.withCredentials = true;
//Default Content-Type
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;