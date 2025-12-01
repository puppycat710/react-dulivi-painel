import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import OrderCard from './OrderCard'
import OrderDetailsModal from './OrderDetailsModal'

export default function Order() {
	const [orders, setOrders] = useState([])
	const [selectedOrderId, setSelectedOrderId] = useState(null)
	const [orderDetails, setOrderDetails] = useState(null)
	const token = sessionStorage.getItem('token')
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	// Listar todos pedidos
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await api.get(`/order/all?fk_store_id=${fk_store_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const orders = response.data

				if (response.data.success) {
					setOrders(orders.data)
				}
			} catch (err) {
				console.error('Erro ao buscar pedidos:', err)
			}
		}

		fetchOrders()
	}, [fk_store_id])
	// Consultar detalhes do pedido
	useEffect(() => {
		if (selectedOrderId !== null) {
			setOrderDetails(null)
			const fetchOrder = async () => {
				try {
					const res = await api.get(`/order/${selectedOrderId}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
					const order_details = res.data
					setOrderDetails(order_details.data)
				} catch (error) {
					console.error('Erro ao buscar detalhes do pedido:', error)
				}
			}
			fetchOrder()
		}
	}, [selectedOrderId])

	return (
		<div style={{ textAlign: 'center', padding: '50px' }}>
			<main className='size-full flex flex-wrap gap-4'>
				{orders.map((order, index) => (
					<OrderCard
						onClick={() => setSelectedOrderId(order.id)}
						key={index}
						index={index}
						order={order}
					/>
				))}
			</main>
			{selectedOrderId && (
				<OrderDetailsModal
					orderDetails={orderDetails}
					setSelectedOrderId={setSelectedOrderId}
				/>
			)}
		</div>
	)
}
