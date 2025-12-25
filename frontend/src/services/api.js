import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const encodeImage = async (imageFile, message, password) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('message', message);
    formData.append('password', password);

    // We use responseType 'blob' because the server is sending back an image file
    return axios.post(`${API_URL}/encode`, formData, {
        responseType: 'blob',
    });
};