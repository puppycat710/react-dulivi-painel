import { useEffect, useState } from 'react'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { api } from '../../services/api'


export default function StorePayment() {
	const [status, setStatus] = useState('desativado')
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await api.get(`/store/${fk_store_id}`)
				// Espera que a API retorne algo como { active: true/false }
				if (response.data.data.mercadopago_access_token) {
					setStatus('ativado')
				} else {
					setStatus('desativado')
				}
				setLoading(false)
			} catch (error) {
				console.error('Erro ao buscar status do Mercado Pago', error)
			}
		}

		fetchStatus()
	}, [fk_store_id])

	const handleActivate = () => {
		const clientId = '1065243732499157'
		const redirectUri = encodeURIComponent(
			'https://cardapio-digital-api-nzm1.onrender.com/auth/mercadopago/callback'
		)
		const oauthUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=${fk_store_id}&redirect_uri=${redirectUri}`

		window.location.href = oauthUrl
	}

	if (loading) return <div className="p-6 text-center text-gray-500"><p>Carregando...</p></div>

	return (
		<Card className='w-full max-w-md mx-auto mt-10'>
			<CardHeader>
				<CardTitle>Integração Mercado Pago</CardTitle>
				<CardDescription>Gerencie o status de pagamentos da sua loja.</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<span>Status:</span>
					<Badge variant={status === 'ativado' ? 'success' : 'destructive'}>
						{status === 'ativado' ? 'Ativado' : 'Desativado'}
					</Badge>
				</div>

				{status === 'desativado' && (
					<Button onClick={handleActivate} className='w-full' variant='default'>
						Ativar Pagamentos
					</Button>
				)}

				{status === 'ativado' && (
					<Button disabled className='w-full cursor-not-allowed' variant='outline'>
						Pagamentos Ativados
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
