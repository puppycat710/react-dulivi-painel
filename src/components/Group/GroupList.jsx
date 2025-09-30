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
import { GroupActions } from './GroupActions'

export default function GroupList() {
	const [groups, setGroups] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')
  const token = sessionStorage.getItem('token')

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await api.get(`/group/all?fk_store_id=${fk_store_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.data.success) {
					setGroups(response.data.data)
				} else {
					console.warn('Nenhum produto encontrado.')
				}
			} catch (err) {
				console.error('Erro ao buscar produtos:', err)
			}
		}

		fetchGroups()
	}, [fk_store_id])

	return (
		<Table>
			<TableCaption>Lista de grupos cadastrados</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Grupo</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{groups.map((group) => (
					<TableRow key={group.id}>
						<TableCell>{group.name}</TableCell>
						<TableCell className='text-right'>
							<GroupActions group={group} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
