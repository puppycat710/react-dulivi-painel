'use client'

import { useState } from 'react'
// Shadcn
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Switch } from '../../../components/ui/switch'
import { Checkbox } from '../../../components/ui/checkbox'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'
import { ConfirmCheck } from './ConfirmCheck'

const initialForm = {
	title: '',
	option_limit: 20,
	option_minimum: 0,
	multiple_selection: 0,
	required: 0,
	is_combo_group: 0,
}

export default function ComplementGroupForm() {
	const [form, setForm] = useState(initialForm)
	const [uploading, setUploading] = useState(false)
	const { alert, showAlert } = useAlert()
	const [confirmCheck, setConfirmCheck] = useState(false)
	const [confirmCheckCombo, setConfirmCheckCombo] = useState(false)
	const [pendingComboCheck, setPendingComboCheck] = useState(false)
	const [pendingCheck, setPendingCheck] = useState(false)
	//Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Input text/number
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}
	// Switch / Checkbox
	const handleSwitchChange = (checked, field) => {
		setForm((prev) => ({
			...prev,
			[field]: checked ? 1 : 0,
		}))
	}
	const handleCheckboxChange = (checked) => {
		if (checked) {
			// Se o usuário marcar como obrigatório, mostra o alerta antes
			setPendingCheck(true)
			setConfirmCheck(true)
		} else {
			// Se desmarcar, apenas atualiza normalmente
			handleSwitchChange(false, 'required')
		}
	}
	const handleConfirm = () => {
		handleSwitchChange(pendingCheck, 'required')
		setConfirmCheck(false)
		setPendingCheck(false)
	}
	const handleCancel = () => {
		// Cancela e não altera o valor atual
		setConfirmCheck(false)
		setPendingCheck(false)
	}
	// --- Funções específicas do campo "é combo" ---
	const handleComboSwitchChange = (checked) => {
		if (checked) {
			// Se marcar, exibe o ConfirmCheck antes de confirmar
			setPendingComboCheck(true)
			setConfirmCheckCombo(true)
		} else {
			// Se desmarcar, apenas atualiza diretamente
			handleSwitchChange(false, 'is_combo_group')
		}
	}
	const handleComboConfirm = () => {
		handleSwitchChange(pendingComboCheck, 'is_combo_group')
		setConfirmCheckCombo(false)
		setPendingComboCheck(false)
	}
	const handleComboCancel = () => {
		// Cancela e não altera o valor atual
		setConfirmCheckCombo(false)
		setPendingComboCheck(false)
	}
	// Criar grupo de complemento
	const handleCreateComplementGroup = async () => {
		if (!form.title) {
			showAlert(
				ErrorAlert,
				{ title: 'Campos obrigatórios', text: 'Preencha todos os campos antes de salvar.' },
				1500
			)
			return
		}

		try {
			const payload = {
				...form,
				fk_store_id: Number(fk_store_id),
			}
			await api.post('/complement-group/create', payload, {
				headers: { Authorization: `Bearer ${token}` },
			})
			handleCreateSuccess()
		} catch {
			handleCreateError()
		}
	}
	const handleCreateSuccess = () => {
		showAlert(
			SuccessAlert,
			{ title: 'Cadastrado com sucesso!', text: 'O grupo foi cadastrado.' },
			1500,
			() => (window.location.href = '/grupos-complementos')
		)
	}
	const handleCreateError = () => {
		showAlert(
			ErrorAlert,
			{ title: 'Erro ao cadastrar!', text: 'O grupo não foi cadastrado.' },
			1500
		)
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Grupo de Complementos</h1>

			<div className='grid gap-4'>
				{/* Título */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='title'>Título:</Label>
					<Input
						name='title'
						placeholder='Título'
						value={form.title}
						onChange={handleChange}
						required
					/>
				</div>
				{/* Limite de opções */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='option_limit'>Limite de opções:</Label>
					<Input
						type='number'
						name='option_limit'
						min={1}
						value={form.option_limit}
						onChange={handleChange}
					/>
				</div>
				{/* Minimo de opções */}
				<div className='flex flex-col gap-2'>
					<Label htmlFor='option_minimum'>Limite de opções:</Label>
					<Input
						type='number'
						name='option_minimum'
						min={1}
						value={form.option_minimum}
						onChange={handleChange}
					/>
				</div>
				{/* Seleção múltipla */}
				<div className='flex gap-3 border-1 w-fit px-4 py-2 rounded-md'>
					<Label htmlFor='multiple_selection'>Seleção múltipla:</Label>
					<Switch
						checked={!!form.multiple_selection}
						onCheckedChange={(checked) => handleSwitchChange(checked, 'multiple_selection')}
					/>
				</div>
				{/* Obrigatório */}
				<div className='flex gap-3 border-1 w-fit px-4 py-2 rounded-md'>
					<Label htmlFor='required'>Obrigatório:</Label>
					<Checkbox
						id='required'
						checked={!!form.required}
						onCheckedChange={(checked) => handleCheckboxChange(checked, 'required')}
					/>
				</div>
				{/* É grupo de combo */}
				<div className='flex gap-3 border-1 w-fit px-4 py-2 rounded-md'>
					<Label htmlFor='is_combo_group'>Esse grupo vai ser combo?</Label>
					<Switch
						id='is_combo_group'
						checked={!!form.is_combo_group}
						onCheckedChange={handleComboSwitchChange}
					/>
				</div>
			</div>
			{/* Botões */}
			<div className='flex justify-end gap-2 mt-6'>
				<Button variant='outline' onClick={() => setForm(initialForm)}>
					Cancelar
				</Button>
				<Button onClick={handleCreateComplementGroup} disabled={uploading}>
					{uploading ? 'Enviando...' : 'Cadastrar'}
				</Button>
			</div>
			{confirmCheck && (
				<>
					<ConfirmCheck
						description={
							'Esta categoria será obrigatória. Isso significa que o cliente precisará escolher pelo menos um complemento antes de adicionar o produto ao carrinho.'
						}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					></ConfirmCheck>
				</>
			)}
			{confirmCheckCombo && (
				<ConfirmCheck
					description={
						'Este grupo será usado em combos. Os complementos terão acréscimos no valor do produto.'
					}
					onConfirm={handleComboConfirm}
					onCancel={handleComboCancel}
				></ConfirmCheck>
			)}
			{alert}
		</div>
	)
}
