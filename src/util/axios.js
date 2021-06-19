//for testing porpose

import axios from 'axios';

const instance = axios.create({
    baseURL: ''
});

instance.defaults.headers.common['Authorization'] = '';
instance.defaults.headers.post[''] = '';

export default instance;