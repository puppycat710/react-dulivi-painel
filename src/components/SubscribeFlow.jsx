'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

const PLANS = [
	{ slug: 'start', name: 'Start', price: 'R$ 79,90/mês', features: ['Cardápio digital', 'Pedidos ilimitados', 'Suporte diário'] },
	{ slug: 'pro', name: 'Pro', price: 'R$ 139,90/mês', highlight: true, features: ['Tudo do Start', 'IA WhatsApp', 'Relatórios'] },
	{ slug: 'turbo', name: 'Turbo', price: 'R$ 249,90/mês', features: ['Tudo do Pro', 'NF-e', 'Anúncios', 'Cashback'] },
]

export default function SubscribeFlow() {
	const [step, setStep] = useState('plan')
	const [plan, setPlan] = useState(null)
	const [loading, setLoading] = useState(false)
	const [form, setForm] = useState({ cardholderName: '', identificationNumber: '' })
	const [mpInstance, setMpInstance] = useState(null)
	const [mpFieldsMounted, setMpFieldsMounted] = useState(false)

	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	// Carregar SDK V2 do Mercado Pago
	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://sdk.mercadopago.com/js/v2'
		script.async = true
		script.onload = () => {
			const mp = new window.MercadoPago('APP_USR-a7dfd18d-01b9-4ce6-8ce3-66dfcad07aad', { locale: 'pt-BR' })
			setMpInstance(mp)
		}
		document.body.appendChild(script)
	}, [])

	// Montar Secure Fields quando mpInstance estiver pronto
	useEffect(() => {
		if (mpInstance && step === 'card' && !mpFieldsMounted) {
			mpInstance.fields.create('cardNumber', { placeholder: 'Número do cartão' }).mount('cardNumber')
			mpInstance.fields.create('expirationDate', { placeholder: 'MM/AA' }).mount('expirationDate')
			mpInstance.fields.create('securityCode', { placeholder: 'CVV' }).mount('securityCode')
			setMpFieldsMounted(true)
		}
	}, [mpInstance, step, mpFieldsMounted])

	const handleSubscribe = async (e) => {
		e.preventDefault()
		if (!mpInstance) return
		setLoading(true)

		try {
			// Cria token do cartão
			const cardToken = await mpInstance.createCardToken({
				cardholderName: form.cardholderName,
				identificationType: 'CPF',
				identificationNumber: form.identificationNumber,
			})

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
			window.location.href = '/meu-plano'
		} catch (err) {
			console.error(err)
			alert('Erro ao assinar plano')
		} finally {
			setLoading(false)
		}
	}

	// =========================
	// STEP 1 — ESCOLHER PLANO
	// =========================
	if (step === 'plan') {
		return (
			<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
				{PLANS.map((p) => (
					<div key={p.slug} className={`border rounded-xl p-6 shadow-sm ${p.highlight ? 'border-blue-500 scale-105' : ''}`}>
						<h2 className="text-xl font-bold">{p.name}</h2>
						<p className="text-2xl font-semibold mt-2">{p.price}</p>
						<ul className="mt-4 space-y-1 text-sm text-gray-600">
							{p.features.map((f) => (<li key={f}>✔ {f}</li>))}
						</ul>
						<button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg" onClick={() => { setPlan(p.slug); setStep('card') }}>
							Escolher plano
						</button>
					</div>
				))}
			</div>
		)
	}

	// =========================
	// STEP 2 — PAGAMENTO COM CARTÃO
	// =========================
	return (
		<form onSubmit={handleSubscribe} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-3">
			<h2 className="text-xl font-bold">Pagamento</h2>
			<p className="text-sm text-gray-500">Plano selecionado: <b>{plan}</b></p>

			<input
				placeholder="Nome do titular"
				className="border p-2 w-full rounded"
				required
				value={form.cardholderName}
				onChange={(e) => setForm({ ...form, cardholderName: e.target.value })}
			/>

			<input
				placeholder="CPF"
				className="border p-2 w-full rounded"
				required
				maxLength={11}
				value={form.identificationNumber}
				onChange={(e) => setForm({ ...form, identificationNumber: e.target.value })}
			/>

			{/* Aqui vem os Secure Fields */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">Número do cartão</label>
				<div id="cardNumber" className="border rounded-lg p-2 h-10"></div>
			</div>

			<div className="flex gap-2">
				<div className="flex-1">
					<label className="block text-sm font-medium text-gray-700">Validade</label>
					<div id="expirationDate" className="border rounded-lg p-2 h-10"></div>
				</div>
				<div className="flex-1">
					<label className="block text-sm font-medium text-gray-700">CVV</label>
					<div id="securityCode" className="border rounded-lg p-2 h-10"></div>
				</div>
			</div>

			<button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg mt-4">
				{loading ? 'Processando...' : 'Confirmar Assinatura'}
			</button>

			<button type="button" onClick={() => setStep('plan')} className="w-full text-sm text-gray-500 mt-2">
				← Voltar para planos
			</button>
		</form>
	)
}
