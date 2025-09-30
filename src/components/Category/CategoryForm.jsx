'use client'

import { useState } from 'react'
// Shadcn
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

const initialForm = {
	title: '',
	image: '',
	fk_store_categories_id: '',
}

export default function CategoryForm() {
	const [form, setForm] = useState(initialForm)
	const [uploading, setUploading] = useState(false)
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Image Upload
	const handleImageChange = async (e) => {
		const file = e.target.files[0]
		if (!file) return
		// lock button
		setUploading(true)
		try {
			const formData = new FormData()
			formData.append('imagem', file)
			// upload image to supabase
			const res = await api.post('/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			// add image url
			if (res.data?.url) {
				setForm((prev) => ({ ...prev, image: res.data.url }))
			}
		} catch {
			handleUploadError()
		} finally {
			// unlock button
			setUploading(false)
		}
	}
	// Create Category
	const handleCreateProduct = async () => {
		if (!form.title) {
			showAlert(
				ErrorAlert,
				{
					title: 'Campos obrigatórios',
					text: 'Preencha todos os campos antes de salvar.',
				},
				1500
			)
			return
		}

		try {
			const payload = {
				...form,
				fk_store_id: Number(fk_store_id),
			}

			await api.post('/category/create', payload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			// Success
			handleCreateSuccess()
		} catch {
			// Error
			handleCreateError()
		}
	}
	// Product Alert
	const handleCreateSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Cadastrado com sucesso!',
				text: 'O item foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/categorias')
		)
	}
	const handleCreateError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao cadastrar categoria!',
				text: 'O item foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/categorias')
		)
	}
	// Upload Alert
	const handleUploadError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro no upload da imagem!',
				text: 'A imagem não foi cadastrada.',
			},
			1500,
			() => (window.location.href = '/categorias')
		)
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Categoria</h1>

			<div className='grid gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='title'>Título:</Label>
					<Input name='title' placeholder='Título' value={form.title} onChange={handleChange} required />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='image'>Imagem:</Label>
					<div className='w-40 h-40 border rounded-xl overflow-hidden relative cursor-pointer group'>
						<input type='file' accept='image/*' onChange={handleImageChange} className='absolute inset-0 opacity-0 cursor-pointer z-10' />
						<img src={form.image || '/assets/image.png'} alt='Imagem do produto' className='w-full h-full object-cover group-hover:opacity-60 transition duration-200' />
					</div>
				</div>

				<div className='flex justify-end gap-2 mt-4'>
					<Button variant='outline' onClick={() => setForm(initialForm)}>
						Cancelar
					</Button>
					<Button onClick={handleCreateProduct} disabled={uploading}>
						{uploading ? 'Enviando...' : 'Cadastrar'}
					</Button>
				</div>
			</div>
			{alert}
		</div>
	)
}
