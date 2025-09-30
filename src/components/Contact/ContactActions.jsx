import { useEffect, useState } from 'react'
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
import { Checkbox } from '../../../components/ui/checkbox'

export function ContactActions({ contact }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...contact })
	const [groups, setGroups] = useState([])
	const [selectedGroups, setSelectedGroups] = useState([])
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Carregar grupos da loja
	useEffect(() => {
		async function fetchGroups() {
			const res = await api.get(`/group/all?fk_store_id=${fk_store_id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setGroups(res.data.data)
		}
		fetchGroups()
	}, [])
	// Carregar grupos do contato
	useEffect(() => {
		async function fetchContactGroups() {
			const res = await api.get(`/contact-group/all?fk_store_id=${fk_store_id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})

			// pega todos vínculos desse contato
			const found = res.data.data.filter((cg) => cg.fk_contact_id === contact.id).map((cg) => cg.fk_group_id)

			setSelectedGroups(found)
		}

		if (open) fetchContactGroups()
	}, [open])
	// alternar grupo
	const toggleGroup = (groupId) => {
		setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]))
	}
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Update Contact + ContactGroup
	const handleUpdateContact = async () => {
		if (!form.id || !form.name || !form.contact || !selectedGroups) {
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
			// Atualizar contato
			await api.put(
				`/contact/update/${form.id}`,
				{
					data: {
						name: form.name,
						contact: form.contact,
						fk_store_id: Number(fk_store_id),
					},
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			// Atualizar vínculo contato-grupo
			await api.post(
				`/contact-group/upsert`, // precisa já ter esse id carregado no form
				{
					fk_contact_id: form.id,
					groups: selectedGroups,
					fk_store_id: Number(fk_store_id),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)

			handleUpdateSuccess()
		} catch (err) {
			console.error(err)
			handleUpdateError()
		}
	}
	// Delete Contact
	const handleDeleteContact = async () => {
		try {
			await api.delete(`/contact/delete/${form.id}`, {
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
			() => (window.location.href = '/contatos')
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
			() => (window.location.href = '/contatos')
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
			() => (window.location.href = '/contatos')
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
			() => (window.location.href = '/contatos')
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
							<DialogTitle>Editar Contato</DialogTitle>
							<DialogDescription>Atualize os dados e clique em salvar para confirmar.</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='name'>Nome:</Label>
								<Input name='name' placeholder='Grupo' value={form.name} onChange={handleChange} required />
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='contact'>Contato:</Label>
								<Input name='contact' placeholder='Contato' value={form.contact} onChange={handleChange} required />
							</div>
							{/* Select de Grupos */}
							<div className='flex flex-col gap-2'>
								<Label>Grupos:</Label>
								<div className='flex flex-col gap-2 max-h-40 overflow-auto border rounded p-2'>
									{groups.map((group) => (
										<div key={group.id} className='flex items-center gap-2'>
											<Checkbox checked={selectedGroups.includes(group.id)} onCheckedChange={() => toggleGroup(group.id)} />
											<span>{group.name}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button variant='outline' onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateContact}>Salvar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				{/* delete button with alert dialog */}
				<DeleteButtonWithDialog onConfirm={handleDeleteContact} />
			</div>
			{alert}
		</>
	)
}
