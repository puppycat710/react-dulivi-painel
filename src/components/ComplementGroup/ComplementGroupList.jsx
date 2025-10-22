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
import { ComplementGroupActions } from './ComplementGroupActions'
import { Switch } from '../../../components/ui/switch'
import { Checkbox } from '../../../components/ui/checkbox'

export default function ComplementGroupList() {
	const [complementGroups, setComplementGroups] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')

	useEffect(() => {
		const fetchComplementGroups = async () => {
			try {
				const response = await api.get(`/complement-group/all?fk_store_id=${fk_store_id}`)
				if (response.status === 200) {
					setComplementGroups(response.data)
				} else {
					console.warn('Nenhum grupo de complemento encontrado.')
				}
			} catch (err) {
				console.error('Erro ao buscar grupos de complementos:', err)
			}
		}

		fetchComplementGroups()
	}, [fk_store_id])

	return (
		<Table>
			<TableCaption>Lista de grupos de complementos cadastrados</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Título</TableHead>
					<TableHead>Limite de opções</TableHead>
					<TableHead>Mínimo de opções</TableHead>
					<TableHead>Seleção múltipla</TableHead>
					<TableHead>Obrigatório</TableHead>
					<TableHead>Combo</TableHead>
					<TableHead>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{complementGroups.map((complementGroup) => (
					<TableRow key={complementGroup.id}>
						<TableCell>{complementGroup.title}</TableCell>
						{/* Limite de opções */}
						<TableCell>{complementGroup.option_limit ?? '-'}</TableCell>
						{/* Limite de opções */}
						<TableCell>{complementGroup.option_minimum ?? '-'}</TableCell>
						{/* Seleção múltipla (Switch) */}
						<TableCell>
							<Switch checked={!!complementGroup.multiple_selection} disabled />
						</TableCell>
						{/* Obrigatório (Checkbox) */}
						<TableCell>
							<Checkbox checked={!!complementGroup.required} disabled />
						</TableCell>
						{/* Combo (Checkbox) */}
						<TableCell>
							<Checkbox checked={!!complementGroup.is_combo_group} disabled />
						</TableCell>
						{/* Ações */}
						<TableCell className='text-right'>
							<ComplementGroupActions complementGroup={complementGroup} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
