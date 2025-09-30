import SvgTimeDelivery from '../svg/SvgTimeDelivery'
import SvgCustomerInfo from '../svg/SvgCustomerInfo'
import SvgPaymentMethod from '../svg/SvgPaymentMethod'
import OrderTime from './OrderTime'
import SvgCalendar from '../svg/SvgCalendar'
import OrderStatusButton from './OrderStatusButton'
import SvgWithdrawl from '../svg/SvgWithdrawl'
import SvgPin from '../svg/SvgPin'
import SvgCashback from '../svg/SvgCashback'

export default function OrderDetailsModal({ orderDetails, setSelectedOrderId }) {
	const deliveryLabels = {
		retirada: 'Recebimento',
		entrega: 'Entregar em',
		no_local: 'Recebimento',
	}
	// Nome do mês
	function getMonthNameByNumber(number) {
		const month = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

		if (number < 1 || number > 12) {
			throw new Error('Número do mês inválido. Use um valor de 1 a 12.')
		}

		return month[number - 1]
	}

	return (
		<div className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center'>
			<div className='bg-white text-sm p-6 rounded shadow-lg w-full max-w-xl relative max-h-[98vh] overflow-y-auto'>
				<button onClick={() => setSelectedOrderId(null)} className='text-xl font-bold absolute top-2 right-2 cursor-pointer'>
					✕
				</button>

				{!orderDetails ? (
					<p>Carregando...</p>
				) : (
					<div className='text-[#797e99]'>
						<h2 className='text-sm text-black/80 font-bold mb-1'>Resumo do pedido</h2>
						<OrderTime created_at={orderDetails.created_at} />
						<hr className='border-black/16 mb-3 mt-5' />
						<div className='flex flex-col items-start gap-3 ml-1.5'>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-1'>
									<SvgPin width={18} height={18} fill='#797e99' />
									<span className='font-semibold'>{deliveryLabels[orderDetails.delivery_method]}</span>
								</div>
								<div className='ml-7 text-start leading-[14px]'>
									<span className='text-sm text-black font-semibold'>
										{orderDetails.delivery_method === 'entrega' ? orderDetails.delivery_address : orderDetails.delivery_method === 'retirada' ? 'Retirar no restaurante' : 'Consumir no restaurante'}
									</span>
								</div>
							</div>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-1'>
									<SvgTimeDelivery fill='#797e99' width={18} height={18} />
									<span className='font-semibold'>Tempo de entrega</span>
								</div>
								<div className='ml-7 text-start leading-[14px]'>
									<span className='text-xs font-bold text-black'>30 - 40min</span>
								</div>
							</div>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-1'>
									<SvgPaymentMethod fill='#797e99' width={18} height={18} />
									<span className='font-semibold'>Forma de pagamento</span>
								</div>
								<div className='ml-7 text-start leading-[14px]'>
									<span className='text-xs font-bold text-black'>
										{orderDetails.payment_method.charAt(0).toUpperCase() + orderDetails.payment_method.slice(1)} ({orderDetails.paid === 'true' ? 'Online' : 'Na entrega'})
									</span>
								</div>
							</div>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-1'>
									<SvgCustomerInfo fill='#797e99' width={18} height={18} />
									<span className='font-semibold'>Informações do cliente</span>
								</div>
								<div className='flex flex-col ml-7 text-start leading-[14px]'>
									<span className='text-xs font-bold text-black'>Nome: {orderDetails.customer_name}</span>
									<span className='text-xs font-bold text-black'>Telefone: {orderDetails.customer_whatsapp}</span>
								</div>
							</div>
							<div>
								{orderDetails.created_at &&
									(() => {
										const [date, time] = orderDetails.created_at.split(' ')
										const [year, month, day] = date.split('-')
										const formattedDate = `${day}/${month}/${year}`

										return (
											<div className='flex flex-col items-start gap-1'>
												<div className='flex items-center gap-1'>
													<SvgCalendar fill='#797e99' width={16} height={16} />
													<span className='font-semibold'>Criação do pedido</span>
												</div>
												<div className='flex flex-col ml-7 text-start leading-[14px]'>
													<span className='text-xs font-bold text-black'>
														{'->'} {time}
													</span>
													<span className='text-xs font-bold text-black'>
														Data: {day} de {getMonthNameByNumber(month)} de {year}
													</span>
												</div>
											</div>
										)
									})()}
							</div>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-1'>
									<SvgWithdrawl fill='#797e99' width={18} height={18} />
									<span className='font-semibold'>Status do pedido</span>
								</div>
								<div className='ml-7 text-start leading-[14px]'>
									<OrderStatusButton order={orderDetails} />
								</div>
							</div>
							<div className='flex flex-col gap-0.5'>
								<div className='flex items-center gap-1'>
									<SvgCashback fill='#797e99' className='rotate-135' width={18} height={18} />
									<span className='font-semibold'>Cliente receberá de cashback</span>
								</div>
								<div className='flex flex-col ml-7 text-start leading-[14px]'>
									<span className='text-[#075914] text-xs font-black'>+R$ {orderDetails.cashback_amount ? Number(orderDetails.cashback_amount).toFixed(2).replace('.', ',') : '0,00'}</span>
								</div>
							</div>
						</div>
						<hr className='border-black/16 mb-3 mt-5' />
						<div className='flex flex-col text-black/80 ml-1.5'>
							<span className='text-xs font-bold mt-0.5 mb-3.5 mr-auto'>Itens do pedido</span>
							<div className='flex flex-col gap-3 ml-3'>
								{orderDetails.items.map((item, index) => (
									<div key={index} className='flex flex-col gap-0.5 text-sm text-black'>
										<div className='flex justify-between'>
											<span className='font-black'>
												({item.quantity}) {item.product_title}
											</span>
											<span className='font-medium text-black/80'>R$ {Number(item.price).toFixed(2).replace('.', ',')}</span>
										</div>
										{item.complements?.length > 0 && (
											<div className='flex flex-col items-start text-xs text-black/80 font-medium'>
												{item.complements.map((add, i) => (
													<span key={i}>
														({add.quantity}) {add.title}: R$ {(Number(add.price) * add.quantity).toFixed(2).replace('.', ',')}
													</span>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
						<div className='flex flex-col w-full items-start mt-6'>
							<span className='text-xs font-bold text-black/70 mb-1.5'>Resumo dos valores</span>
							<div className='flex w-full justify-between items-center text-xs text-black/70 font-medium'>
								<span>Subtotal:</span>
								<span>
									R${' '}
									{orderDetails
										? Number(orderDetails.total_amount - orderDetails.delivery_fee)
												.toFixed(2)
												.replace('.', ',')
										: '0,00'}
								</span>
							</div>
							<div className='flex w-full justify-between items-center text-xs text-black/70 font-medium'>
								<span>Taxa de entrega:</span>
								<span>R$ {orderDetails ? Number(orderDetails.delivery_fee).toFixed(2).replace('.', ',') : '0,00'}</span>
							</div>
							<div className='flex w-full mt-3 justify-between items-center font-extrabold text-black/80'>
								<span>Total:</span>
								<span>R$ {orderDetails ? Number(orderDetails.total_amount).toFixed(2).replace('.', ',') : '0,00'}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
