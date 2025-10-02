import { useEffect, useState } from 'react'
// Components
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Checkbox } from '../../../components/ui/checkbox'
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

export function GroupActions({ group }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...group })
	const [contacts, setContacts] = useState([])
	const [selectedContacts, setSelectedContacts] = useState([])
	const { alert, showAlert } = useAlert()
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Carregar contatos da loja
	useEffect(() => {
		async function fecthContact() {
			const res = await api.get(`/contact/all?fk_store_id=${fk_store_id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setContacts(res.data.data)
		}
		fecthContact()
	}, [])
	// Carregar grupos do contato
	useEffect(() => {
		async function fetchContactGroups() {
			const res = await api.get(`/contact-group/all?fk_store_id=${fk_store_id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})

			// pega todos vínculos desse grupo
			const found = res.data.data
				.filter((cg) => cg.fk_group_id === form.id) // compara com o grupo atual
				.map((cg) => cg.fk_contact_id) // pega os contatos vinculados

			setSelectedContacts(found)
		}

		if (open) fetchContactGroups()
	}, [open])
	// alternar contato
	const toggleContact = (groupId) => {
		setSelectedContacts((prev) => (prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]))
	}
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Update Group
	const handleUpdateGroup = async () => {
		try {
			// atualizar grupo
			await api.put(
				`/group/update/${form.id}`,
				{ data: form },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			// Atualizar vínculo contato-grupo
			await api.post(
				`/contact-group/bulk-upsert`, // precisa já ter esse id carregado no form
				{
					fk_group_id: form.id,
					contacts: selectedContacts,
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
			handleUpdateError()
		}
	}
	// Delete Group
	const handleDeleteGroup = async () => {
		try {
			await api.delete(`/group/delete/${form.id}`, {
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
							<DialogDescription>Atualize os dados e clique em salvar para confirmar.</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='name'>Grupo:</Label>
								<Input name='name' placeholder='Grupo' value={form.name} onChange={handleChange} required />
							</div>
							{/* Select de Grupos */}
							<div className='flex flex-col gap-2'>
								<Label>Contatos:</Label>
								<div className='flex flex-col gap-2 max-h-40 overflow-auto border rounded p-2'>
									{contacts.map((contact) => (
										<div key={contact.id} className='flex items-center gap-2'>
											<Checkbox
												checked={selectedContacts.includes(contact.id)}
												onCheckedChange={() => toggleContact(contact.id)}
											/>
											<span>{contact.name}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button variant='outline' onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateGroup}>Salvar</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				{/* delete button with alert dialog */}
				<DeleteButtonWithDialog onConfirm={handleDeleteGroup} />
			</div>
			{alert}
		</>
	)
}
