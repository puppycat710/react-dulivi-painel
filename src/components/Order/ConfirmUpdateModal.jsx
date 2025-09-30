import { useState } from 'react'
import { api } from '../../services/api'
import OrderStatusSelector from './OrderStatusSelector'

export default function ConfirmUpdateModal({ onClose, orderId }) {
	const [showConfirm, setShowConfirm] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState('')
	const token = sessionStorage.getItem('token')

	const statusLabels = {
		aceito: 'Aceitar',
		preparando: 'Preparar',
		entrega: 'Entregar',
		concluido: 'Concluir',
	}

	const updateStatus = async () => {
		try {
			await api.put(
				'/order/update',
				{
					id: orderId,
					data: { status: selectedStatus },
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			onClose()
			window.location.reload()
		} catch (error) {
			alert('Erro ao atualizar status do pedido.')
		}
	}

	return (
		<div className='w-[100px] bg-[#CCCCCC] rounded-lg absolute'>
			{/* Pop-up de confirmação */}
			{showConfirm && (
				<div className='fixed top-0 left-0 w-full h-full bg-black/70 bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg p-4 shadow-md text-center'>
						<p className='mb-4'>
							Deseja <strong>{statusLabels[selectedStatus]}</strong> o pedido?
						</p>
						<div className='flex justify-center gap-4'>
							<button
								onClick={() => {
									setShowConfirm(false)
									updateStatus()
								}}
								className='bg-indigo-500 text-white px-4 py-2 rounded cursor-pointer'
							>
								Sim
							</button>
							<button onClick={() => setShowConfirm(false)} className='bg-gray-300 px-4 py-2 rounded cursor-pointer'>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}

			<OrderStatusSelector setSelectedStatus={setSelectedStatus} setShowConfirm={setShowConfirm} />
		</div>
	)
}
