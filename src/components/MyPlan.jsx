import {
	initMercadoPago,
	createCardToken,
	CardNumber,
	SecurityCode,
	ExpirationDate,
} from '@mercadopago/sdk-react'

initMercadoPago('APP_USR-a7dfd18d-01b9-4ce6-8ce3-66dfcad07aad')
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ConfirmButton } from './ConfirmButton'
import SuccessAlert from './SuccessAlert'
import ErrorAlert from './ErrorAlert'
import { useAlert } from '../hooks/useAlert'

export default function MyPlan() {
	const [sub, setSub] = useState(null)
	const [loading, setLoading] = useState(false)
	const [showCardModal, setShowCardModal] = useState(false)
	const [newPlan, setNewPlan] = useState('')
	const [confirmType, setConfirmType] = useState(null)
	const [cardForm, setCardForm] = useState({
		cardholderName: '',
		identificationNumber: '',
	})
	// Alert
	const { alert, showAlert } = useAlert()
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	const statusMap = {
		authorized: {
			label: 'Ativo',
			class: 'bg-green-100 text-green-700',
		},
		paused: {
			label: 'Pausado',
			class: 'bg-yellow-100 text-yellow-700',
		},
		cancelled: {
			label: 'Cancelado',
			class: 'bg-red-100 text-red-700',
		},
	}

	const api = axios.create({
		baseURL: 'https://cardapio-digital-api-nzm1.onrender.com',
		headers: { Authorization: `Bearer ${token}` },
	})

	useEffect(() => {
		api.get(`/subscriptions/${fk_store_id}`).then(res => {
			setSub(res.data)
			setNewPlan(res.data.plan_slug)
		})
	}, [])

	const handleAction = async (endpoint) => {
		setLoading(true)
		try {
			await api.put(endpoint)
			const res = await api.get(`/subscriptions/${fk_store_id}`)
			setSub(res.data)
		} finally {
			setLoading(false)
		}
	}

	const handleChangePlan = async () => {
		if (!newPlan || newPlan === sub.plan_slug) return
		setLoading(true)
		try {
			await api.put(`/subscriptions/${fk_store_id}/change-plan`, {
				new_plan_slug: newPlan,
			})
			const res = await api.get(`/subscriptions/${fk_store_id}`)
			setSub(res.data)
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateCard = async () => {
		if (!cardForm.cardholderName || !cardForm.identificationNumber) {
			showAlert(
				ErrorAlert,
				{
					title: 'Preencha nome e CPF do titular',
					text: 'O cartão não foi atualizado.',
				},
				1500,
				() => (window.location.href = '/meu-plano')
			)
			return
		}

		setLoading(true)
		try {
			// Criar token do cartão via Mercado Pago
			const cardToken = await createCardToken({
				cardholderName: cardForm.cardholderName,
				identificationType: 'CPF',
				identificationNumber: cardForm.identificationNumber,
			})

			// Enviar token para o backend para atualizar o cartão
			const res = await api.put(`/subscriptions/${fk_store_id}/change-card`, {
				card_token_id: cardToken.id,
			})

			showAlert(
				SuccessAlert,
				{
					title: 'Cartão atualizado com sucesso!',
					text: 'O cartão foi atualizado com sucesso.',
				},
				1500,
				() => (window.location.href = '/meu-plano')
			)
			setShowCardModal(false)
		} catch (err) {
			console.error(err)
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao atualizar cartão',
					text: 'O cartão não foi atualizado.',
				},
				1500,
				() => (window.location.href = '/meu-plano')
			)
		} finally {
			setLoading(false)
		}
	}


	function getBillingInfo(sub) {
		const startDate = new Date(sub.auto_recurring?.start_date)
		const trial = sub.auto_recurring?.free_trial

		if (trial && trial.frequency > 0) {
			const trialEnd = new Date(startDate)
			trialEnd.setDate(trialEnd.getDate() + trial.frequency)

			const today = new Date()
			const diffTime = trialEnd - today
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

			if (diffDays > 0) {
				return {
					type: 'trial',
					text: `Teste grátis • faltam ${diffDays} dia${diffDays > 1 ? 's' : ''}`,
				}
			}

			return {
				type: 'billing',
				text: `Próxima cobrança em ${trialEnd.toLocaleDateString('pt-BR')}`,
			}
		}

		if (sub.next_payment_date) {
			return {
				type: 'billing',
				text: `Próxima cobrança em ${new Date(sub.next_payment_date).toLocaleDateString('pt-BR')}`,
			}
		}

		return {
			type: 'none',
			text: 'Sem cobrança agendada',
		}
	}

	if (!sub) {
		return (
			<div className="p-6 text-center text-gray-500">
				Carregando plano...
			</div>
		)
	}

	return (
		<div className="max-w-3xl mx-auto p-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

				{/* HEADER */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Meu Plano</h2>
						<p className="text-sm text-gray-500">
							Gerencie sua assinatura
						</p>
					</div>

					<span
						className={`px-3 py-1 rounded-full text-sm font-medium
    ${statusMap[sub.status]?.class || 'bg-gray-100 text-gray-600'}
  `}
					>
						{statusMap[sub.status]?.label || sub.status}
					</span>

				</div>

				{/* INFO */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="border rounded-xl p-4">
						<p className="text-sm text-gray-500">Plano atual</p>
						<p className="text-lg font-medium">{sub.reason}</p>
					</div>

					<div className="border rounded-xl p-4">
						<p className="text-sm text-gray-500">Próxima cobrança</p>
						{(() => {
							const billing = getBillingInfo(sub)

							return (
								<p
									className={`text-lg font-medium ${billing.type === 'trial'
										? 'text-blue-600'
										: 'text-gray-900'
										}`}
								>
									{billing.text}
								</p>
							)
						})()}
					</div>
				</div>

				{/* ALTERAR PLANO */}
				<div className="border rounded-xl p-4 space-y-3">
					<p className="font-medium">Mudar plano</p>

					<div className="flex flex-col md:flex-row gap-3">
						<select
							value={newPlan}
							onChange={(e) => setNewPlan(e.target.value)}
							className="w-full border rounded-lg px-3 py-2"
						>
							<option value="start">Start</option>
							<option value="pro">Pro</option>
							<option value="turbo">Turbo</option>
						</select>

						<button
							onClick={handleChangePlan}
							disabled={loading}
							className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
						>
							Atualizar plano
						</button>
					</div>
				</div>

				{/* AÇÕES */}
				<div className="flex flex-wrap gap-3">
					{sub.status === 'authorized' && (
						<button
							onClick={() => setConfirmType('pause')}
							className="px-4 py-2 rounded-lg border hover:bg-gray-100"
						>
							Pausar
						</button>
					)}


					{sub.status === 'paused' && (
						<button
							onClick={() => handleAction(`/subscriptions/${fk_store_id}/reactivate`)}
							className="px-4 py-2 rounded-lg border hover:bg-gray-100"
						>
							Reativar
						</button>
					)}

					<button
						onClick={() => setShowCardModal(true)}
						className="px-4 py-2 rounded-lg border hover:bg-gray-100"
					>
						Mudar cartão
					</button>

					<button
						onClick={() => setConfirmType('cancel')}
						className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
					>
						Cancelar plano
					</button>
				</div>
			</div>

			{/* MODAL CARTÃO */}
			{showCardModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
						<h3 className="text-lg font-semibold">Atualizar cartão</h3>

						<p className="text-sm text-gray-500">
							Insira os dados do novo cartão
						</p>

						{/* Aqui depois você injeta o SDK/tokenização */}
						<form
							onSubmit={async (e) => {
								e.preventDefault()
								setLoading(true)

								try {
									const cardToken = await createCardToken({
										cardholderName: cardForm.cardholderName,
										identificationType: 'CPF',
										identificationNumber: cardForm.identificationNumber,
									})

									await api.put(`/subscriptions/${fk_store_id}/update-card`, {
										card_token_id: cardToken.id,
									})

									alert('Cartão atualizado com sucesso!')
									setShowCardModal(false)
								} catch (err) {
									alert('Erro ao atualizar cartão')
								} finally {
									setLoading(false)
								}
							}}
							className="space-y-3"
						>
							<CardNumber
								placeholder="Número do cartão"
								className="border p-2 w-full rounded"
							/>

							<ExpirationDate
								placeholder="MM/AA"
								mode="short"
								className="border p-2 w-full rounded"
							/>

							<SecurityCode
								placeholder="CVV"
								className="border p-2 w-full rounded"
							/>

							<input
								required
								placeholder="Nome do titular"
								className="border p-2 w-full rounded"
								onChange={(e) =>
									setCardForm({ ...cardForm, cardholderName: e.target.value })
								}
							/>

							<input
								required
								placeholder="CPF"
								maxLength={11}
								className="border p-2 w-full rounded"
								onChange={(e) =>
									setCardForm({ ...cardForm, identificationNumber: e.target.value })
								}
							/>
						</form>


						<div className="flex justify-end gap-3 pt-2">
							<button
								onClick={() => setShowCardModal(false)}
								className="px-4 py-2 rounded-lg border"
							>
								Cancelar
							</button>
							<button
								disabled={loading}
								onClick={handleUpdateCard}
								className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
							>
								{loading ? 'Salvando...' : 'Salvar cartão'}
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Pausar */}
			{confirmType === 'pause' && (
				<ConfirmButton
					open
					title="Pausar assinatura"
					description="Ao pausar, sua assinatura ficará temporariamente inativa e você não será cobrado até reativar."
					confirmText="Pausar assinatura"
					onCancel={() => setConfirmType(null)}
					onConfirm={() =>
						handleAction(`/subscriptions/${fk_store_id}/pause`)
					}
				/>
			)}
			{/* Cancelar */}
			{confirmType === 'cancel' && (
				<ConfirmButton
					open
					title="Cancelar assinatura"
					description="Tem certeza que deseja cancelar seu plano? Essa ação é permanente e não pode ser desfeita."
					confirmText="Cancelar plano"
					destructive
					onCancel={() => setConfirmType(null)}
					onConfirm={() =>
						handleAction(`/subscriptions/${fk_store_id}/cancel`)
					}
				/>
			)}
			{alert}
		</div>
	)
}
