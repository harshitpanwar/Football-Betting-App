import axios from 'axios';

export const getClubs = async ({page, search}) => {
    console.log(page, search);
    const { data } = await axios.get(`http://localhost:5000/api/club?page=${page}&search=${search}`);
    return data;
}   

export const editClub = async ({id, name}) => {
    const { data } = await axios.put(`http://localhost:5000/api/club/${id}`, {name});
    return data;
}

export const deleteClub = async (id) => {
    const { data } = await axios.delete(`http://localhost:5000/api/club/${id}`);
    return data;
}

export const addClub = async ({name}) => {
    const { data } = await axios.post(`http://localhost:5000/api/club`, {name});
    return data;
}
