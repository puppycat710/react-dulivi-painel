'use client'

import { useState } from 'react'
// Shadcn
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

const initialForm = {
	name: '',
	fk_store_categories_id: '',
}

export default function GroupForm() {
	const [form, setForm] = useState(initialForm)
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
	// Create Group
	const handleGroup = async () => {
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

			await api.post('/group/create', payload, {
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
	// Group Alert
	const handleCreateSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Cadastrado com sucesso!',
				text: 'O item foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/grupos')
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
			() => (window.location.href = '/grupos')
		)
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Grupo</h1>

			<div className='grid gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='name'>Grupo:</Label>
					<Input name='name' placeholder='Grupo' value={form.name} onChange={handleChange} required />
				</div>

				<div className='flex justify-end gap-2 mt-4'>
					<Button variant='outline' onClick={() => setForm(initialForm)}>
						Cancelar
					</Button>
					<Button onClick={handleGroup}>Cadastrar</Button>
				</div>
			</div>
			{alert}
		</div>
	)
}
