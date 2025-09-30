import { useEffect, useRef, useState } from 'react'
import SvgArrow from '../svg/SvgArrow'
import ConfirmUpdateModal from './ConfirmUpdateModal'

const OrderStatusButton  = ({ order }) => {
	const [showStatus, setShowStatus] = useState(false)
	const statusRef = useRef(null)

	const toggleStatus = () => setShowStatus((prev) => !prev)
	// Fecha ao clicar fora
	useEffect(() => {
		function handleClickOutside(event) {
			if (statusRef.current && !statusRef.current.contains(event.target)) {
				setShowStatus(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	function getStatusLabel(status) {
		const map = {
			recebido: 'Pendente',
			aceito: 'Aceito',
			preparando: 'Preparando',
			entrega: 'Entrega',
			concluido: 'Concluído',
		}

		return map[status] ?? 'Desconhecido'
	}

	const statusColors = {
		recebido: 'bg-yellow-500 hover:bg-yellow-500/80',
		aceito: 'bg-indigo-500 hover:bg-indigo-500/80',
		preparando: 'bg-orange-500 hover:bg-orange-500/80',
		entrega: 'bg-sky-500 hover:bg-sky-500/80',
		concluido: 'bg-emerald-500 hover:bg-emerald-500/80',
	}
	return (
		<div className='relative' ref={statusRef}>
			<button
				onClick={toggleStatus}
				className={`cursor-pointer px-2 py-1.5 rounded-full flex items-center gap-2 text-white text-xs font-semibold
          ${statusColors[order.status] || 'bg-gray-400 hover:bg-gray-400/80'}
        `}
			>
				<span>{getStatusLabel(order.status)}</span>
				<SvgArrow fill='white' width={10} height={10} className='rotate-90' />
			</button>
			
			{showStatus && <ConfirmUpdateModal orderId={order.id} onClose={() => setShowStatus(false)} />}
		</div>
	)
}

export default OrderStatusButton 
