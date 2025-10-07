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
import { MessageActions } from './MessageActions'

export default function GroupList() {
	const [messages, setMessages] = useState([])
	const [groupsMap, setGroupsMap] = useState({})
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
					const data = response.data.data

					const formatted = data.map((msg) => {
						let date = ''
						let time = ''
						if (msg.send_at) {
							const parts = msg.send_at.split(' ')
							const [year, month, day] = parts[0].split('-')
							date = `${day}/${month}/${year}`
							time = parts[1]
						}
						return { ...msg, date, time }
					})

					setMessages(formatted)
				} else {
					console.warn('Nenhum produto encontrado.')
				}
			} catch (err) {
				console.error('Erro ao buscar produtos:', err)
			}
		}

		fetchMessages()
	}, [fk_store_id])
	// Load GROUPS
	useEffect(() => {
		async function fetchGroups() {
			try {
				const res = await api.get(`/group/all?fk_store_id=${fk_store_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				const map = {}
				res.data.data.forEach((group) => {
					map[group.id] = group.name // ou group.nome dependendo do seu retorno
				})
				setGroupsMap(map)
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

	return (
		<Table>
			<TableCaption>Lista de disparos cadastrados</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Texto do disparo</TableHead>
					<TableHead>Data</TableHead>
					<TableHead>Horário</TableHead>
					<TableHead>Grupo de contatos</TableHead>
					<TableHead>Frequência</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRow key={message.id}>
						<TableCell>{message.text}</TableCell>
						<TableCell>{message.date}</TableCell>
						<TableCell>{message.time.slice(0, 5)}</TableCell>
						<TableCell>{groupsMap[message.fk_group_id] || 'Grupo não encontrado'}</TableCell>
						<TableCell>
							{message.frequency === 'weekdays'
								? 'De segunda a sexta'
								: message.frequency === 'daily'
								? 'Todos os dias'
								: message.frequency === 'once'
								? 'Apenas uma vez'
								: ''}
						</TableCell>

						<TableCell className='text-right'>
							<MessageActions message={message} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
