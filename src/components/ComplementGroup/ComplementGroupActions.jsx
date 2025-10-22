import { useState } from 'react'
// Components
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
} from '../../../components/ui/dialog'
import { Switch } from '../../../components/ui/switch'
import { Checkbox } from '../../../components/ui/checkbox'
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

export function ComplementGroupActions({ complementGroup }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...complementGroup })
	const [uploading, setUploading] = useState(false)
	const { alert, showAlert } = useAlert()
	const token = sessionStorage.getItem('token')
	// Input text/number
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Switch e Checkbox
	const handleSwitchChange = (checked, field) => {
		setForm((prev) => ({
			...prev,
			[field]: checked ? 1 : 0,
		}))
	}
	// Atualizar categoria
	const handleUpdateCategory = async () => {
		try {
			await api.put(
				`/complement-group/update/${form.id}`,
				{ data: form },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			handleUpdateSuccess()
		} catch {
			handleUpdateError()
		}
	}
	// Deletar categoria
	const handleDeleteCategory = async () => {
		try {
			await api.delete(`/complement-group/delete/${form.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			handleDeleteSuccess()
		} catch {
			handleDeleteError()
		}
	}
	// Alertas
	const handleUpdateSuccess = () => {
		showAlert(
			SuccessAlert,
			{
				title: 'Atualizado com sucesso!',
				text: 'O grupo de complementos foi atualizado.',
			},
			1500,
			() => (window.location.href = '/grupos-complementos')
		)
	}
	const handleUpdateError = () => {
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao atualizar!',
				text: 'O grupo não foi atualizado.',
			},
			1500
		)
	}
	const handleDeleteSuccess = () => {
		showAlert(
			SuccessAlert,
			{
				title: 'Deletado com sucesso!',
				text: 'O grupo de complementos foi removido.',
			},
			1500,
			() => (window.location.href = '/grupos-complementos')
		)
	}
	const handleDeleteError = () => {
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao deletar!',
				text: 'Não foi possível remover o grupo.',
			},
			1500
		)
	}

	return (
		<>
			<div className='flex gap-2'>
				{/* Botão editar */}
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button variant='outline' size='icon'>
							<SvgEdit className='w-4 h-4' />
						</Button>
					</DialogTrigger>

					<DialogContent className='sm:max-w-[600px]'>
						<DialogHeader>
							<DialogTitle>Editar Grupo de Complemento</DialogTitle>
							<DialogDescription>
								Atualize os dados e clique em salvar para confirmar.
							</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							{/* Campo título */}
							<div className='flex flex-col gap-2'>
								<Label htmlFor='title'>Título:</Label>
								<Input
									name='title'
									placeholder='Título'
									value={form.title || ''}
									onChange={handleChange}
								/>
							</div>
							{/* Limite de opções */}
							<div className='flex flex-col gap-2'>
								<Label htmlFor='option_limit'>Limite de opções:</Label>
								<Input
									type='number'
									name='option_limit'
									value={form.option_limit ?? 1}
									onChange={handleChange}
									min={1}
								/>
							</div>
							{/* Mínimo de opções */}
							<div className='flex flex-col gap-2'>
								<Label htmlFor='option_minimum'>Limite de opções:</Label>
								<Input
									type='number'
									name='option_minimum'
									value={form.option_minimum ?? 1}
									onChange={handleChange}
									min={1}
								/>
							</div>
							{/* Seleção múltipla */}
							<div className='flex items-center justify-between py-2'>
								<Label htmlFor='multiple_selection'>Seleção múltipla</Label>
								<Switch
									checked={!!form.multiple_selection}
									onCheckedChange={(checked) => handleSwitchChange(checked, 'multiple_selection')}
								/>
							</div>
							{/* Obrigatório */}
							<div className='flex items-center justify-between py-2'>
								<Label htmlFor='required'>Obrigatório</Label>
								<Checkbox
									checked={!!form.required}
									onCheckedChange={(checked) => handleSwitchChange(checked, 'required')}
								/>
							</div>
							{/* Combo */}
							<div className='flex items-center justify-between py-2'>
								<Label htmlFor='is_combo_group'>Esse grupo é um combo?</Label>
								<Checkbox
									checked={!!form.is_combo_group}
									onCheckedChange={(checked) => handleSwitchChange(checked, 'is_combo_group')}
								/>
							</div>
						</div>

						<DialogFooter>
							<Button variant='outline' onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateCategory} disabled={uploading}>
								{uploading ? 'Enviando...' : 'Salvar'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Botão deletar */}
				<DeleteButtonWithDialog onConfirm={handleDeleteCategory} />
			</div>

			{alert}
		</>
	)
}
