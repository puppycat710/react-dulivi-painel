'use client'

import { useEffect, useState } from 'react'
// Shadcn
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Calendar } from '../../../components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

const initialForm = {
	text: '',
	image: '',
	send_at: '',
	fk_group_id: '',
	fk_store_id: '',
}

export default function GroupForm() {
	const [form, setForm] = useState(initialForm)
	const { alert, showAlert } = useAlert()
	const [open, setOpen] = useState(false)
	const [date, setDate] = useState('')
	const [time, setTime] = useState('10:30:00')
	const [groups, setGroups] = useState([])
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
	// Load API GROUPS on startup
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
	// Create Message
	const handleMessage = async () => {
		if (!form.text || !form.fk_group_id || form.frequency || !fk_store_id || !date || !time) {
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

		const send_at = formatDateTime(date, time)

		try {
			const payload = {
				...form,
				send_at,
				fk_store_id: Number(fk_store_id),
			}

			await api.post('/message/create', payload, {
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
	// Message Alert
	const handleCreateSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Cadastrado com sucesso!',
				text: 'O item foi cadastrado.',
			},
			1500,
			() => (window.location.href = '/disparos')
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
			() => (window.location.href = '/disparos')
		)
	}
	// Formatar data e hora
	function formatDateTime(date, time) {
		if (!date || !time) return ''

		const [hours, minutes, seconds] = time.split(':')
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds || '00'}`
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Disparo</h1>

			<div className='grid gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='text'>Mensagem:</Label>
					<Textarea name='text' placeholder='Boa noite...' value={form.text} onChange={handleChange} required />
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
				{/* Select de Frequencia */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='contact'>Frequência:</Label>
					<Select
						required
						value={form.frequency || ''}
						onValueChange={(value) => setForm((prev) => ({ ...prev, frequency: value }))}
					>
						<SelectTrigger>
							<SelectValue placeholder='Selecione uma frequência' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={'once'}>Apenas uma vez</SelectItem>
							<SelectItem value={'daily'}>Todos os dias</SelectItem>
							<SelectItem value={'weekdays'}>De segunda a sexta</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className='flex flex-col gap-2'>
					<div className='flex gap-4'>
						<div className='flex flex-col gap-3'>
							<Label htmlFor='date-picker' className='px-1'>
								Data
							</Label>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button variant='outline' id='date-picker' className='w-32 justify-between font-normal'>
										{date ? date.toLocaleDateString() : 'Select date'}
										<ChevronDownIcon />
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto overflow-hidden p-0' align='start'>
									<Calendar
										mode='single'
										selected={date}
										captionLayout='dropdown'
										onSelect={(date) => {
											setDate(date)
											setOpen(false)
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className='flex flex-col gap-3'>
							<Label htmlFor='time-picker' className='px-1'>
								Horário
							</Label>
							<Input
								value={time}
								onChange={(e) => setTime(e.target.value)}
								type='time'
								id='time-picker'
								step='1'
								className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
							/>
						</div>
					</div>
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
					<Button onClick={handleMessage}>Cadastrar</Button>
				</div>
			</div>
			{alert}
		</div>
	)
}
