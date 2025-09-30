import SvgCustomer from '../svg/SvgCustomer'
import SvgPaid from '../svg/SvgPaid'
import SvgWithdrawl from '../svg/SvgWithdrawl'
import SvgConsume from '../svg/SvgConsume'
import SvgDelivery from '../svg/SvgDelivery'
import OrderStatusButton from './OrderStatusButton'

export default function OrderCard({ onClick, index, order }) {
	const deliveryLabels = {
		retirada: 'Retirada',
		entrega: 'Entrega',
		no_local: 'Consumir no local',
	}

	const deliveryIcons = {
		retirada: <SvgWithdrawl width={20} height={20} fill='#6E6F71' />,
		entrega: <SvgDelivery width={20} height={20} fill='#6E6F71' />,
		no_local: <SvgConsume width={20} height={20} fill='#6E6F71' />,
	}

	function timeSinceOrder(createdAtString) {
		const now = new Date()
		const createdAt = new Date(createdAtString.replace(' ', 'T')) // "2025-06-02 00:00:00" → "2025-06-02T00:00:00"

		const diffMs = now - createdAt
		const diffMinutes = Math.floor(diffMs / 60000)

		if (diffMinutes < 1) return 'Recebido agora mesmo'
		if (diffMinutes < 60) return `Recebido há ${diffMinutes} minutos`

		const diffHours = Math.floor(diffMinutes / 60)
		if (diffHours < 24) return `Recebido há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`

		const diffDays = Math.floor(diffHours / 24)
		return `Recebido há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
	}

	return (
		<div className='flex flex-col items-center py-6 w-full max-w-[280px] bg-white'>
			<header className='w-full flex items-center justify-between px-4'>
				<span className='text-sm font-bold'>#00{index + 1}</span>
				<OrderStatusButton order={order} />
			</header>
			<main onClick={onClick} className='w-full flex flex-col gap-2 cursor-pointer hover:bg-black/4 px-4 py-3'>
				<div className='flex items-center gap-3'>
					<SvgCustomer width={20} height={20} fill='#6E6F71' />
					<span className='text-sm text-black/80 font-semibold'>{order.customer_name}</span>
				</div>
				<div className='flex items-center gap-3'>
					{deliveryIcons[order.delivery_method] || null}
					<span className='text-sm text-black/80 font-semibold'>{deliveryLabels[order.delivery_method] || 'Método desconhecido'}</span>
				</div>
				<div className='flex items-center gap-3'>
					<SvgPaid width={20} height={20} fill='#6E6F71' />
					<span className='text-sm text-black/80 font-semibold'>
						{order.paid === 'true' ? 'Pago' : 'Pagar na Entrega'} - <span className='text-xs text-black/60 font-semibold'>{order.payment_method.toUpperCase()}</span>
					</span>
				</div>
			</main>
			<footer onClick={onClick} className='w-full flex justify-between items-center mt-12 cursor-pointer hover:bg-black/4 px-4 py-2'>
				<span className='text-xs'>{timeSinceOrder(order.created_at)}</span>
				<span className='text-xl font-bold'>R$ {order.total_amount.toFixed(2)}</span>
			</footer>
		</div>
	)
}
