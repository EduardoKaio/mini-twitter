import axios from 'axios';

// Carregar a URL base a partir do arquivo .env
// const API_URL = process.env.REACT_APP_API_URL
const API_URL = 'http://localhost:8000/api/'

const api = axios.create({
  baseURL: API_URL,
});

// Autenticação
const login = async (credentials) => {
  const response = await api.post('login/', credentials);
  return response.data;
};

const refresh = async (refreshToken) => {
  const response = await api.post('refresh/', { refresh: refreshToken });
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('register/', userData);
  return response.data;
};

// Posts
const createPost = async (postData, token) => {
  const response = await api.post('posts/', postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getPost = async (id) => {
  const response = await api.get(`posts/${id}/`);
  return response.data;
};

const updatePost = async (id, postData, token) => {
  const response = await api.put(`posts/${id}/edit/`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
  });
  return response.data;
};

const deletePost = async (id, token) => {
  const response = await api.delete(`posts/${id}/delete/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const likePost = async (id, token) => {
  const response = await api.post(`posts/${id}/like/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Seguidores
const followUser = async (username, token) => {
  const response = await api.post(`follow/${username}/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Certifique-se de que a API retorna `is_following`
};

const unfollowUser = async (username, token) => {
  const response = await api.delete(`unfollow/${username}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const listFollowers = async (token) => {
  const response = await api.get('followers/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.followers || []; // Retorna um array vazio se `followers` for undefined
};

const listFollowing = async (token) => {
  const response = await api.get('following/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.following || []; // Retorna um array vazio se `following` for undefined
};

// Feed
const getFeed = async () => {
  const token = localStorage.getItem('access');
  const response = await api.get('feed/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getMyPosts = async (token) => {
  const response = await api.get('my-posts/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getProfile = async (token) => {
  const response = await api.get('profile/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getUser = async (username, token) => {
  const response = await api.get(`user/${username}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export {
  login,
  refresh,
  register,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  followUser,
  unfollowUser,
  listFollowers,
  listFollowing,
  getFeed,
  getMyPosts,
  getProfile,
  getUser,
};
