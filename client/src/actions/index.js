import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file ,history) => async dispatch => {
  const uploadConfig = await axios.get('/api/upload'); // getting the presigned Url from s3 to upload a file
  
  const upload = await axios.put(uploadConfig.data.url, file, { // presignedUrl , the actual file, and optional headers
      headers: {
        'Content-Type': file.type
      }

  })

  const res = await axios.post('/api/blogs', {
    ...values,
    imageUrl: uploadConfig.data.key
  });

  history.push('/blogs');
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async dispatch => { // haciendo juna peticion a mi servidor de express
  const res = await axios.get('/api/blogs');// los requests que hace axios los trae en una propiedad data

  dispatch({ type: FETCH_BLOGS, payload: res.data }); 
};

export const fetchBlog = id => async dispatch => { // haciendo juna peticion a mi servidor de express
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
