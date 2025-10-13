'use client'

import { useEffect, useState } from 'react'
// Shadcn
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'
import axios from 'axios'

const initialForm = {
	name: '',
	delivery_fee: 0,
	delivery_time_min: 0,
	delivery_time_max: 0,
	fk_store_cities_id: '',
}

export default function DeliveryForm() {
	const [form, setForm] = useState(initialForm)
	const [cities, setCities] = useState([])
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Load API cities on startup
	useEffect(() => {
		async function fetchCities() {
			try {
				const res = await api.get(`/city/all?fk_store_id=${fk_store_id}`)
				setCities(res.data.data)
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
		fetchCities()
	}, [])
	// CEP Search
	const handleCepChange = async (e) => {
		const cep = e.target.value.replace(/\D/g, '')

		if (cep.length === 8) {
			try {
				const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
				const data = res.data
				if (!data.erro) {
					setForm((prev) => ({
						...prev,
						name: data.bairro,
					}))
				}
			} catch (error) {
				console.error('Erro ao buscar endereço pelo CEP:', error)
			}
		}
	}
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Create Delivery Area
	const handleDeliveryArea = async () => {
		if (!form.name) {
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

			await api.post('/deliveryarea/create', payload, {
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
			() => (window.location.href = '/delivery')
		)
	}
	const handleCreateError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao cadastrar item!',
				text: 'O item não foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/delivery')
		)
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Bairro</h1>

			<div className='grid gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='cep'>CEP</Label>
					<Input name='cep' placeholder='CEP' onChange={handleCepChange} />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='name'>Bairro:</Label>
					<Input name='name' placeholder='Bairro' value={form.name} onChange={handleChange} required />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='delivery_fee'>Taxa de Entrega:</Label>
					<Input
						name='delivery_fee'
						placeholder='Taxa de Entrega'
						value={form.delivery_fee}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='delivery_time_min'>Tempo mínimo de entrega:</Label>
					<Input
						name='delivery_time_min'
						placeholder='Tempo mínimo de entrega'
						value={form.delivery_time_min}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='delivery_time_max'>Tempo máximo de entrega:</Label>
					<Input
						name='delivery_time_max'
						placeholder='Tempo máximo de entrega'
						value={form.delivery_time_max}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Select de Cidade */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='city'>Cidade:</Label>
					<Select
						required
						value={form.fk_store_cities_id?.toString() || ''}
						onValueChange={(value) => setForm((prev) => ({ ...prev, fk_store_cities_id: Number(value) }))}
					>
						<SelectTrigger>
							<SelectValue placeholder='Selecione uma cidade' />
						</SelectTrigger>
						<SelectContent>
							{cities.map((city) => (
								<SelectItem key={city.id} value={city.id.toString()}>
									{city.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='flex justify-end gap-2 mt-4'>
					<Button variant='outline' onClick={() => setForm(initialForm)}>
						Cancelar
					</Button>
					<Button onClick={handleDeliveryArea}>Cadastrar</Button>
				</div>
			</div>
			{alert}
		</div>
	)
}
