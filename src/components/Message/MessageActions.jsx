import { useEffect, useState } from 'react'
// Components
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { Calendar } from '../../../components/ui/calendar'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
} from '../../../components/ui/dialog'
// Button
import { DeleteButtonWithDialog } from '../DeleteButtonWithDialog'
// SVG
import SvgEdit from '../svg/SvgEdit'
// Alert
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

export function MessageActions({ message }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...message })
	const [groups, setGroups] = useState([])
	const [date, setDate] = useState('')
	const [time, setTime] = useState('18:30:00')
	//Alert
	const { alert, showAlert } = useAlert()
	//Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Load GROUPS
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
	// Load time
	useEffect(() => {
		if (form?.send_at) {
			// Exemplo de send_at: "2025-10-07 09:00:00"
			const [datePart, timePart] = form.send_at.split(' ')

			// Define a data para o Calendar
			const [year, month, day] = datePart.split('-').map(Number)
			setDate(new Date(year, month - 1, day))

			// Define a hora para o input type="time"
			const [hours, minutes, seconds] = timePart.split(':')
			setTime(`${hours}:${minutes}:${seconds || '00'}`)
		}
	}, [form.send_at])
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
	// Update Message
	const handleUpdateMessage = async () => {
		if (!form.text || !form.fk_group_id || !fk_store_id || !time || !form.frequency) {
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
		const { text, fk_group_id, image, frequency } = form

		try {
			const payload = {
				text,
				fk_group_id,
				image,
				frequency,
				send_at,
			}
			// atualizar grupo
			await api.put(
				`/message/update/${form.id}`,
				{ data: payload },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			handleUpdateSuccess()
		} catch (err) {
			handleUpdateError()
		}
	}
	// Delete Message
	const handleDeleteMessage = async () => {
		try {
			await api.delete(`/message/delete/${form.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			handleDeleteSuccess?.()
		} catch {
			handleDeleteError?.()
		}
	}
	// Update Alert
	const handleUpdateSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Atualizado com sucesso!',
				text: 'O item foi atualizado.',
			},
			1500,
			() => (window.location.href = '/disparos')
		)
	}
	const handleUpdateError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao atualizar item!',
				text: 'O item não foi atualizado.',
			},
			1500,
			() => (window.location.href = '/disparos')
		)
	}
	// Delete Alert
	const handleDeleteSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Deletado com sucesso!',
				text: 'O item foi removido.',
			},
			1500,
			() => (window.location.href = '/disparos')
		)
	}
	const handleDeleteError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao deletar item!',
				text: 'O item não foi removido.',
			},
			1500,
			() => (window.location.href = '/disparos')
		)
	}
	// Formatar data e hora
	function formatDateTime(date, time) {
		const d = date ? new Date(date) : new Date()

		const [hours, minutes, seconds] = time.split(':')
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds || '00'}`
	}

	return (
		<>
			<div className='flex gap-2'>
				{/* edit button with dialog */}
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						{/* edit button */}
						<Button variant='outline' size='icon'>
							<SvgEdit className='w-4 h-4' />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[600px]'>
						<DialogHeader>
							<DialogTitle>Editar Grupo</DialogTitle>
							<DialogDescription>
								Atualize os dados e clique em salvar para confirmar.
							</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='text'>Mensagem:</Label>
								<Textarea
									name='text'
									placeholder='Boa noite...'
									value={form.text}
									onChange={handleChange}
									required
								/>
							</div>
							<div className='flex gap-4'>
								{/* Select de Grupos */}
								<div className='flex flex-col gap-2'>
									<Label htmlFor='contact'>Grupo:</Label>
									<Select
										required
										value={form.fk_group_id?.toString() || ''}
										onValueChange={(value) =>
											setForm((prev) => ({ ...prev, fk_group_id: Number(value) }))
										}
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
							</div>
							{/* Horario */}
							<div className='flex flex-col gap-3 w-fit'>
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
							{/* Data */}
							<div className='flex flex-col gap-2'>
								<div className='flex gap-4'>
									<div className='flex flex-col gap-3'>
										<Label htmlFor='date-picker' className='px-1'>
											Data
										</Label>
										<Calendar
											mode='single'
											selected={date}
											captionLayout='dropdown'
											value={date}
											onSelect={(date) => setDate(date)}
										/>
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
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button variant='outline' onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateMessage}>Salvar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				{/* delete button with alert dialog */}
				<DeleteButtonWithDialog onConfirm={handleDeleteMessage} />
			</div>
			{alert}
		</>
	)
}
