import { useState, useEffect } from 'react'
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select'
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

export function CityActions({ city }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...city })
	const { alert, showAlert } = useAlert()

	const token = sessionStorage.getItem('token')

	// Estados e cidades
	const [estados, setEstados] = useState([])
	const [cidades, setCidades] = useState([])

	// Carrega estados ao abrir o dialog
	useEffect(() => {
		const fetchEstados = async () => {
			try {
				const res = await api.get('/estados')
				setEstados(res.data.data)
			} catch (error) {
				console.error('Erro ao carregar estados:', error)
			}
		}

		fetchEstados()
	}, [open])

	// Carrega cidades quando muda o estado selecionado
	useEffect(() => {
		const fetchCidades = async () => {
			if (form.estado) {
				try {
					const res = await api.get(`/cidades/${form.estado}`)
					setCidades(res.data.data)
				} catch (error) {
					console.error('Erro ao carregar cidades:', error)
				}
			}
		}

		fetchCidades()
	}, [form.estado])

	const handleUpdateCity = async () => {
		console.log(form.id)
		try {
			await api.put(
				`/city/update/${form.id}`,
				{ data: { name: form.cidade } },
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

	// Alerta sucesso / erro
	const handleUpdateSuccess = () => {
		showAlert(
			SuccessAlert,
			{
				title: 'Atualizado com sucesso!',
				text: 'O item foi atualizado.',
			},
			1500,
			() => (window.location.href = '/cidades')
		)
	}
	const handleUpdateError = () => {
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao atualizar item!',
				text: 'O item não foi atualizado.',
			},
			1500
		)
	}

	const handleDeleteCategory = async () => {
		try {
			await api.delete(`/city/delete/${form.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			showAlert(
				SuccessAlert,
				{
					title: 'Deletado com sucesso!',
					text: 'O item foi removido.',
				},
				1500,
				() => (window.location.href = '/cidades')
			)
		} catch {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao deletar item!',
					text: 'O item não foi removido.',
				},
				1500
			)
		}
	}

	return (
		<>
			<div className='flex gap-2'>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button variant='outline' size='icon'>
							<SvgEdit className='w-4 h-4' />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[600px]'>
						<DialogHeader>
							<DialogTitle>Editar Cidade</DialogTitle>
							<DialogDescription>Atualize os dados e clique em salvar para confirmar.</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							{/* Estado */}
							<div className='flex flex-col gap-2'>
								<Label htmlFor='estado'>Estado:</Label>
								<Select
									value={form.estado || ''}
									onValueChange={(value) =>
										setForm((prev) => ({
											...prev,
											estado: value,
											cidade: '',
										}))
									}
								>
									<SelectTrigger id='estado'>
										<SelectValue placeholder='Selecione o estado' />
									</SelectTrigger>
									<SelectContent>
										{estados.map((e) => (
											<SelectItem key={e.id} value={String(e.id)}>
												{e.nome}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Cidade */}
							<div className='flex flex-col gap-2'>
								<Label htmlFor='cidade'>Cidade:</Label>
								<Select value={form.cidade || ''} onValueChange={(value) => setForm((prev) => ({ ...prev, cidade: value }))} disabled={!form.estado}>
									<SelectTrigger id='cidade'>
										<SelectValue placeholder='Selecione a cidade' />
									</SelectTrigger>
									<SelectContent>
										{cidades.map((c) => (
											<SelectItem key={c.id} value={c.nome}>
												{c.nome}
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
							<Button onClick={handleUpdateCity}>
								Salvar
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<DeleteButtonWithDialog onConfirm={handleDeleteCategory} />
			</div>
			{alert}
		</>
	)
}
