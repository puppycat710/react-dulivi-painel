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
import { GroupActions } from './MessageActions'

export default function GroupList() {
	const [messages, setMessages] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')
  const token = sessionStorage.getItem('token')

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await api.get(`/message/all?fk_store_id=${fk_store_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.data.success) {
					setMessages(response.data.data)
				} else {
					console.warn('Nenhum produto encontrado.')
				}
			} catch (err) {
				console.error('Erro ao buscar produtos:', err)
			}
		}

		fetchMessages()
	}, [fk_store_id])

	return (
		<Table>
			<TableCaption>Lista de disparos cadastrados</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Texto do disparo</TableHead>
					<TableHead>Data</TableHead>
					<TableHead>Grupo de contatos</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRow key={message.id}>
						<TableCell>{message.text}</TableCell>
						<TableCell>{message.send_at}</TableCell>
						<TableCell>{message.fk_group_id}</TableCell>
						<TableCell>{message.sent}</TableCell>
						<TableCell className='text-right'>
							<GroupActions message={message} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
