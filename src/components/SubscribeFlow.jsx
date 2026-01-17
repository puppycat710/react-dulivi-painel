'use client'

import { useState, useEffect } from 'react'
import {
	initMercadoPago,
	createCardToken,
	CardNumber,
	SecurityCode,
	ExpirationDate,
} from '@mercadopago/sdk-react'
import axios from 'axios'
import SuccessAlert from './SuccessAlert'
import ErrorAlert from './ErrorAlert'
import { useAlert } from '../hooks/useAlert'

initMercadoPago('APP_USR-a7dfd18d-01b9-4ce6-8ce3-66dfcad07aad')

const PLANS = [
	{
		slug: 'start',
		name: 'Start',
		price: 'R$ 79,90/mês',
		features: ['Cardápio digital', 'Pedidos ilimitados', 'Suporte diário'],
	},
	{
		slug: 'pro',
		name: 'Pro',
		price: 'R$ 139,90/mês',
		highlight: true,
		features: ['Tudo do Start', 'IA WhatsApp', 'Relatórios'],
	},
	{
		slug: 'turbo',
		name: 'Turbo',
		price: 'R$ 249,90/mês',
		features: ['Tudo do Pro', 'NF-e', 'Anúncios', 'Cashback'],
	},
]

export default function SubscribeFlow() {
	const [step, setStep] = useState('plan')
	const [plan, setPlan] = useState(null)
	const [loading, setLoading] = useState(false)
	// Alert
	const { alert, showAlert } = useAlert()
	const [form, setForm] = useState({
		cardholderName: '',
		identificationNumber: '',
	})

	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	const [mpBlocked, setMpBlocked] = useState(false)

	useEffect(() => {
		initMercadoPago('APP_USR-a7dfd18d-01b9-4ce6-8ce3-66dfcad07aad')

		const observer = new MutationObserver(() => {
			const iframe = document.querySelector('iframe[src*="mercadopago"]')
			if (iframe) {
				setMpBlocked(false) // iframe apareceu, tudo certo
				observer.disconnect()
			}
		})

		observer.observe(document.body, { childList: true, subtree: true })

		// fallback: se não aparecer depois de 5s, assume bloqueio
		const fallback = setTimeout(() => {
			const iframe = document.querySelector('iframe[src*="mercadopago"]')
			if (!iframe) setMpBlocked(true)
			observer.disconnect()
		}, 5000)

		return () => {
			observer.disconnect()
			clearTimeout(fallback)
		}
	}, [])

	if (mpBlocked) {
		return (
			<div className='bg-yellow-100 border border-yellow-400 p-4 rounded'>
				<p className='text-sm text-yellow-800'>
					Detectamos um bloqueador de anúncios que impede o carregamento do pagamento por
					cartão.
					<br />
					👉 Desative o AdBlock ou use outro navegador.
				</p>
			</div>
		)
	}

	const handleSubscribe = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const cardToken = await createCardToken({
				cardholderName: form.cardholderName,
				identificationType: 'CPF',
				identificationNumber: form.identificationNumber,
			})

			console.log(cardToken)

			await axios.post(
				'https://cardapio-digital-api-nzm1.onrender.com/subscriptions/subscribe',
				{
					plan_slug: plan,
					payer_email: 'joaojpmoreira25@gmail.com',
					card_token_id: cardToken.id,
					fk_store_id,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			alert('Plano assinado com sucesso!')
			showAlert(
				SuccessAlert,
				{
					title: 'Plano assinado com sucesso!',
					text: 'O plano foi assinado com sucesso.',
				},
				1500,
				() => (window.location.href = '/meu-plano')
			)
		} catch (err) {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao assinar plano',
					text: 'O plano não foi assinado.',
				},
				1500,
				() => (window.location.href = '/meu-plano')
			)
		} finally {
			setLoading(false)
		}
	}

	// =========================
	// STEP 1 — ESCOLHER PLANO
	// =========================
	if (step === 'plan') {
		return (
			<div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-6'>
				{PLANS.map((p) => (
					<div
						key={p.slug}
						className={`border rounded-xl p-6 shadow-sm ${p.highlight ? 'border-blue-500 scale-105' : ''
							}`}
					>
						<h2 className='text-xl font-bold'>{p.name}</h2>
						<p className='text-2xl font-semibold mt-2'>{p.price}</p>

						<ul className='mt-4 space-y-1 text-sm text-gray-600'>
							{p.features.map((f) => (
								<li key={f}>✔ {f}</li>
							))}
						</ul>

						<button
							className='mt-6 w-full bg-blue-600 text-white py-2 rounded-lg'
							onClick={() => {
								setPlan(p.slug)
								setStep('card')
							}}
						>
							Escolher plano
						</button>
					</div>
				))}
			</div>
		)
	}

	// =========================
	// STEP 2 — CARTÃO
	// =========================
	return (
		<form
			onSubmit={handleSubscribe}
			className='max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-3'
		>
			<h2 className='text-xl font-bold'>Pagamento</h2>
			<p className='text-sm text-gray-500'>
				Plano selecionado: <b>{plan}</b>
			</p>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">Número do cartão</label>
				<div className="border rounded-lg p-2">
					<CardNumber
						placeholder="Número do cartão"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">Data de validade</label>
				<div className="border rounded-lg p-2">
					<ExpirationDate
						placeholder='MM/AA'
						mode='short'
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">Código de segurança</label>
				<div className="border rounded-lg p-2">
					<SecurityCode placeholder='CVV' />
				</div>
			</div>

			<input
				placeholder='Nome do titular'
				className='border p-2 w-full rounded'
				required
				onChange={(e) => setForm({ ...form, cardholderName: e.target.value })}
			/>

			<input
				placeholder='CPF'
				className='border p-2 w-full rounded'
				required
				maxLength={11}
				onChange={(e) => setForm({ ...form, identificationNumber: e.target.value })}
			/>

			<button
				disabled={loading}
				className='w-full bg-green-600 text-white py-2 rounded-lg mt-4'
			>
				{loading ? 'Processando...' : 'Confirmar Assinatura'}
			</button>

			<button
				type='button'
				onClick={() => setStep('plan')}
				className='w-full text-sm text-gray-500 mt-2'
			>
				← Voltar para planos
			</button>
			{alert}
		</form>
	)
}
