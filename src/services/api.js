import axios from 'axios'

export const api = axios.create({
	baseURL: 'https://cardapio-digital-api-nzm1.onrender.com/api',
})