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
import { DeliveryActions } from './DeliveryActions'

export default function DeliveryList() {
	const [deliveryAreas, setDeliveryArea] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')

	useEffect(() => {
		const fetchDeliveryArea = async () => {
			try {
				const res = await api.get(`/deliveryarea/all?fk_store_id=${fk_store_id}`)
				const data = res.data.data
				setDeliveryArea(data)
			} catch (err) {
				console.error('Erro ao buscar bairros:', err)
			}
		}

		fetchDeliveryArea()
	}, [fk_store_id])

	return (
		<div className='overflow-hidden rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Bairro</TableHead>
						<TableHead>Taxa de Entrega</TableHead>
						<TableHead>Tempo mínimo de entrega</TableHead>
						<TableHead>Tempo máximo de entrega</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{deliveryAreas.map((deliveryArea) => (
						<TableRow key={deliveryArea.id}>
							<TableCell>{deliveryArea.name}</TableCell>
							<TableCell>R$ {deliveryArea.delivery_fee}</TableCell>
							<TableCell>{deliveryArea.delivery_time_min} minutos</TableCell>
							<TableCell>{deliveryArea.delivery_time_max} minutos</TableCell>
							<TableCell className='text-right'>
								<DeliveryActions deliveryArea={deliveryArea} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
