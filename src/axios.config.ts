import axios from 'axios';

axios.defaults.baseURL = process.env.SERVER_URL;
axios.defaults.headers.common['Authorization'] = process.env.API_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios