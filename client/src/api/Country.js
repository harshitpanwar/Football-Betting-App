import axios from '../utils/axiosConfig';

export const getCountries = async () => {
    const { data } = await axios.get(`/country`);
    return data;
}
