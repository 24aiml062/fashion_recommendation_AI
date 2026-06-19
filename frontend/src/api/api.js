import axios from 'axios'

const BASE = '/api'

// Profile
export const getProfile = () => axios.get(`${BASE}/profile`)
export const saveProfile = (data) => axios.post(`${BASE}/profile`, data)
export const updateProfile = (data) => axios.put(`${BASE}/profile`, data)

// Body analysis
export const analyzeBody = (file) => {
  const form = new FormData()
  form.append('file', file)
  return axios.post(`${BASE}/analyze-user`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const getBodyProfile = () => axios.get(`${BASE}/body-profile`)

// Wardrobe
export const uploadClothing = (file) => {
  const form = new FormData()
  form.append('file', file)
  return axios.post(`${BASE}/upload-clothing`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const getWardrobe = () => axios.get(`${BASE}/wardrobe`)
export const updateWardrobeItem = (id, data) => axios.put(`${BASE}/wardrobe/${id}`, data)  // NEW
export const deleteWardrobeItem = (id) => axios.delete(`${BASE}/wardrobe/${id}`)

// Recommendations
export const getRecommendation = (data) => axios.post(`${BASE}/recommend-outfit`, data)
