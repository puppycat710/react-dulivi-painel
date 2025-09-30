import { useEffect, useState } from 'react'
// Components
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
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

export function MessageActions({ deliveryArea }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...deliveryArea })
	const [cities, setCities] = useState([])
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const token = sessionStorage.getItem('token')
	const fk_store_id = sessionStorage.getItem('fk_store_id')
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
						title: 'Erro ao buscar cidades!',
						text: `${err}`,
					},
					1500
				)
			}
		}
		fetchCities()
	}, [])
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Update Delivery Area
	const handleUpdateDeliveryArea = async () => {
		try {
			await api.put(
				`/deliveryarea/update/${form.id}`,
				{ data: form },
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
	// Delete Delivery Area
	const handleDeleteDeliveryArea = async () => {
		try {
			await api.delete(`/deliveryarea/delete/${form.id}`, {
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
			() => (window.location.href = '/delivery')
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
			() => (window.location.href = '/delivery')
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
			() => (window.location.href = '/delivery')
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
			() => (window.location.href = '/delivery')
		)
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
							<DialogTitle>Editar Categoria</DialogTitle>
							<DialogDescription>Atualize os dados e clique em salvar para confirmar.</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
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
								<Label htmlFor='category'>Cidade:</Label>
								<Select
									required
									value={form.fk_store_cities_id?.toString() || ''}
									onValueChange={(value) => setForm((prev) => ({ ...prev, fk_store_cities_id: Number(value) }))}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={
												form.fk_store_cities_id
													? cities.find((c) => c.id === form.fk_store_cities_id)?.name
													: 'Selecione uma cidade'
											}
										/>
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
						</div>

						<DialogFooter>
							<Button variant='outline' onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateDeliveryArea}>Salvar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				{/* delete button with alert dialog */}
				<DeleteButtonWithDialog onConfirm={handleDeleteDeliveryArea} />
			</div>
			{alert}
		</>
	)
}
