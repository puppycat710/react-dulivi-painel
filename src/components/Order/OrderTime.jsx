import { useEffect, useState } from 'react'
import SvgOrderTime from '../svg/SvgOrderTime'

export default function OrderTime({ created_at }) {
	const [orderTime, setOrderTime] = useState('')

	useEffect(() => {
		const updateTime = () => {
			const dataCriacao = new Date(created_at.replace(' ', 'T')) // ISO 8601
			const agora = new Date()
			const diffMs = agora - dataCriacao

			const segundos = Math.floor(diffMs / 1000) % 60
			const minutos = Math.floor(diffMs / (1000 * 60)) % 60
			const horas = Math.floor(diffMs / (1000 * 60 * 60))

			let texto = ''
			if (horas > 0) texto += `${horas}h `
			if (minutos > 0 || horas > 0) texto += `${minutos}min `
			texto += `${segundos}s`

			setOrderTime(texto)
		}

		// Atualiza imediatamente ao montar
		updateTime()

		// Atualiza a cada segundo
		const interval = setInterval(updateTime, 1000)

		// Limpa o intervalo ao desmontar
		return () => clearInterval(interval)
	}, [created_at])

	return (
		<div className='flex items-center gap-1 w-fit mx-auto'>
			<SvgOrderTime width={18} height={18} className='fill-dulivi' />
			<span className='text-xs text-dulivi font-bold'>
				Pedido feito há <span className='text-black'>{orderTime}</span>
			</span>
		</div>
	)
}
