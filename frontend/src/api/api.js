import axios from 'axios'

// In production (Vercel), VITE_API_URL is set to your Render backend URL.
// In local dev, it's empty so the Vite proxy handles /api → localhost:8000.
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '/api'

// Profile
export const getProfile = () => axios.get(`${BASE}/profile`)
export const saveProfile = (data) => axios.post(`${BASE}/profile`, data)
export const updateProfile = (data) => axios.put(`${BASE}/profile`, data)

// Body analysis
export const analyzeBody = (file) => {
  const form = new FormData()
  form.append('file', file)
  return axios.post(`${BASE}/analyze-user`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  })
}
export const getBodyProfile = () => axios.get(`${BASE}/body-profile`)

// Wardrobe
export const uploadClothing = (file) => {
  const form = new FormData()
  form.append('file', file)
  return axios.post(`${BASE}/upload-clothing`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  })
}
export const getWardrobe = () => axios.get(`${BASE}/wardrobe`)
export const updateWardrobeItem = (id, data) => axios.put(`${BASE}/wardrobe/${id}`, data)
export const deleteWardrobeItem = (id) => axios.delete(`${BASE}/wardrobe/${id}`)

// Recommendations
export const getRecommendation = (data) => axios.post(`${BASE}/recommend-outfit`, data, {
  timeout: 30000,
})
