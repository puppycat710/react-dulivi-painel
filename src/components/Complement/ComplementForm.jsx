'use client'

import { useEffect, useState } from 'react'
// Shadcn
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../components/ui/select'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

const initialForm = {
	title: '',
	description: '',
	price: 20,
	image: '',
	combo_surcharge: 0,
	fk_complement_group_id: '',
}

export default function ComplementForm() {
	const [form, setForm] = useState(initialForm)
	const [categories, setCategories] = useState([])
	const [uploading, setUploading] = useState(false)
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	// Load API categories on startup
	useEffect(() => {
		async function fetchCategories() {
			try {
				const res = await api.get(`/complement-group/all?fk_store_id=${fk_store_id}`)
				setCategories(res.data)
			} catch (err) {
				showAlert(
					ErrorAlert,
					{
						title: 'Erro ao buscar categorias!',
						text: `${err}`,
					},
					1500
				)
			}
		}
		fetchCategories()
	}, [])
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]:
				name === 'price' || name.includes('weight') || name === 'servings'
					? Number(value)
					: value,
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
	// Create Complement
	const handleCreateProduct = async () => {
		const fieldMessages = {
			title: 'Nome do complemento é obrigatório.',
			fk_complement_group_id: 'Escolha um grupo de complementos.',
			price: 'Informe o preço.',
		}

		for (const field in fieldMessages) {
			if (!form[field]) {
				showAlert(
					ErrorAlert,
					{
						title: 'Campo obrigatório',
						text: fieldMessages[field],
					},
					1500
				)
				return
			}
		}

		try {
			const payload = {
				...form,
				fk_complement_group_id: Number(form.fk_complement_group_id),
				fk_store_id: Number(fk_store_id),
			}

			await api.post('/complement/create', payload, {
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
			() => (window.location.href = '/complementos')
		)
	}
	const handleCreateError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao cadastrar item!',
				text: 'O item foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/complementos')
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
			() => (window.location.href = '/complementos')
		)
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Complemento</h1>

			<div className='grid gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='title'>Título:</Label>
					<Input
						name='title'
						placeholder='Título'
						value={form.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='description'>Descrição:</Label>
					<Textarea
						name='description'
						placeholder='Descrição'
						className='resize-none'
						value={form.description}
						onChange={handleChange}
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='price'>Preço:</Label>
					<Input
						name='price'
						type='number'
						placeholder='Preço'
						value={form.price}
						onChange={handleChange}
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='combo_surcharge'>Preço no Combo:</Label>
					<Input
						name='combo_surcharge'
						type='number'
						placeholder='Preço'
						value={form.combo_surcharge}
						onChange={handleChange}
					/>
				</div>
				{/* Select de Categoria */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='category'>Categoria:</Label>
					<Select
						required
						value={form.fk_complement_group_id?.toString() || ''}
						onValueChange={(value) =>
							setForm((prev) => ({ ...prev, fk_complement_group_id: Number(value) }))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder='Selecione uma categoria' />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id.toString()}>
									{category.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='image'>Imagem:</Label>
					<div className='w-40 h-40 border rounded-xl overflow-hidden relative cursor-pointer group'>
						<input
							type='file'
							accept='image/*'
							onChange={handleImageChange}
							className='absolute inset-0 opacity-0 cursor-pointer z-10'
						/>
						<img
							src={form.image || '/assets/image.png'}
							alt='Imagem do produto'
							className='w-full h-full object-cover group-hover:opacity-60 transition duration-200'
						/>
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
