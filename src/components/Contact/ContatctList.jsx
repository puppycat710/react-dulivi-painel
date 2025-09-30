import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../components/ui/table'
import { ContactActions } from './ContactActions'

export default function ContatctList() {
	const [contacts, setContacts] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')
  const token = sessionStorage.getItem('token')

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const response = await api.get(`/contact/all?fk_store_id=${fk_store_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.data.success) {
					setContacts(response.data.data)
				} else {
					console.warn('Nenhum produto encontrado.')
				}
			} catch (err) {
				console.error('Erro ao buscar produtos:', err)
			}
		}

		fetchContacts()
	}, [fk_store_id])

	return (
		<Table>
			<TableCaption>Lista de contatos cadastrados</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Nome</TableHead>
					<TableHead>Contato</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{contacts.map((contact) => (
					<TableRow key={contact.id}>
						<TableCell>{contact.name}</TableCell>
						<TableCell>{contact.contact}</TableCell>
						<TableCell className='text-right'>
							<ContactActions contact={contact} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
