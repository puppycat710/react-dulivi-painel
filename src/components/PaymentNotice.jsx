import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { api } from '../services/api'

export default function PaymentNotice() {
	const [show, setShow] = useState(false) // se mostra notificação
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	useEffect(() => {
		const checkStatus = async () => {
			try {
				const res = await api.get(`/store/${fk_store_id}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				const store = res.data.data
				const hasToken = !store.mercadopago_access_token

				// Abre ou fecha automaticamente
				if (hasToken && store.is_closed) {
					await api.put(
						`/store/update/${fk_store_id}`,
						{ data: { is_closed: 0 } },
						{ headers: { Authorization: `Bearer ${token}` } }
					)
				} else if (!hasToken && !store.is_closed) {
					await api.put(
						`/store/update/${fk_store_id}`,
						{ data: { is_closed: 1 } },
						{ headers: { Authorization: `Bearer ${token}` } }
					)
				}

				setShow(!hasToken) // mostra notificação só se não tiver token
			} catch (err) {
				console.error('Erro ao checar status do Mercado Pago:', err)
			}
		}

		checkStatus()
	}, [fk_store_id, token])

	if (!show) return null

	return (
		<div className='fixed bottom-4 right-4 w-80 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50 flex flex-col gap-3 animate-slide-up'>
			<div className='flex items-center justify-between'>
				<span className='font-semibold text-gray-700'>Pagamentos desativados</span>
				<Badge variant='destructive'>Ação necessária</Badge>
			</div>
			<p className='text-sm text-gray-600'>
				Para começar a receber pedidos, ative os pagamentos da sua loja.
			</p>
			<Button onClick={() => (window.location.href = '/ativar')} className='w-full'>
				Ativar Pagamentos
			</Button>
		</div>
	)
}
