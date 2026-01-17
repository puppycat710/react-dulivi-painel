import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SubscriptionGate() {
	const [loading, setLoading] = useState(true)
	const [hasSubscription, setHasSubscription] = useState(false)

	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	useEffect(() => {
		const check = async () => {
			try {
				const res = await axios.get(`https://cardapio-digital-api-nzm1.onrender.com/subscriptions/${fk_store_id}`, {
					headers: { Authorization: `Bearer ${token}` },
				})

				const sub = res.data
				// só considera assinatura válida se não estiver cancelada
				if (sub && sub.status && sub.status !== 'cancelled') {
					setHasSubscription(true)
				} else {
					setHasSubscription(false)
				}
			} catch (err) {
				// se deu erro, NÃO tem assinatura
				setHasSubscription(false)
			} finally {
				setLoading(false)
			}
		}

		check()
	}, [])

	if (loading) return <p>Carregando...</p>

	return hasSubscription ? (
		<button onClick={() => (window.location.href = '/meu-plano')}>Gerenciar plano</button>
	) : (
		<button onClick={() => (window.location.href = '/planos')}>Assinar plano</button>
	)
}
