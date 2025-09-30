'use client'

import { useEffect, useState } from 'react'
// Shadcn
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

const initialForm = {
	name: '',
	contact: '',
	fk_store_categories_id: '',
}

export default function ContactForm() {
	const [form, setForm] = useState(initialForm)
	const [groups, setGroups] = useState([])
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Load API categories on startup
	useEffect(() => {
		async function fetchGroups() {
			try {
				const res = await api.get(`/group/all?fk_store_id=${fk_store_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				setGroups(res.data.data)
			} catch (err) {
				showAlert(
					ErrorAlert,
					{
						title: 'Erro ao buscar grupos!',
						text: `${err}`,
					},
					1500
				)
			}
		}
		fetchGroups()
	}, [])
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Create Contact
	const handleContact = async () => {
		if (!form.name || !form.contact || !form.fk_group_id) {
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
			// Primeiro cria o contato
			const payload = {
				name: form.name,
				contact: form.contact,
				fk_store_id: Number(fk_store_id),
			}

			const { data: contactRes } = await api.post('/contact/create', payload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			const fk_contact_id = contactRes?.data?.id
			console.log(fk_contact_id)
			// Agora vincula ao grupo escolhido
			const payload2 = {
				fk_contact_id,
				fk_group_id: form.fk_group_id,
				fk_store_id: Number(fk_store_id),
			}

			await api.post('/contact-group/upsert', payload2, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			// Success
			handleCreateSuccess()
		} catch (err) {
			console.error(err)
			handleCreateError()
		}
	}
	// Contact Alert
	const handleCreateSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Cadastrado com sucesso!',
				text: 'O item foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/contatos')
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
			() => (window.location.href = '/contatos')
		)
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Contato</h1>

			<div className='grid gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='name'>Nome:</Label>
					<Input name='name' placeholder='Nome' value={form.name} onChange={handleChange} required />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='contact'>Número:</Label>
					<Input name='contact' placeholder='Número' value={form.contact} onChange={handleChange} required />
				</div>
				{/* Select de Grupos */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='contact'>Grupo:</Label>
					<Select
						required
						value={form.fk_group_id?.toString() || ''}
						onValueChange={(value) => setForm((prev) => ({ ...prev, fk_group_id: Number(value) }))}
					>
						<SelectTrigger>
							<SelectValue placeholder='Selecione um grupo' />
						</SelectTrigger>
						<SelectContent>
							{groups.map((group) => (
								<SelectItem key={group.id} value={group.id.toString()}>
									{group.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='flex justify-end gap-2 mt-4'>
					<Button variant='outline' onClick={() => setForm(initialForm)}>
						Cancelar
					</Button>
					<Button onClick={handleContact}>Cadastrar</Button>
				</div>
			</div>
			{alert}
		</div>
	)
}
