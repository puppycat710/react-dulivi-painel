import { useEffect, useState } from 'react'
// API
import axios from 'axios'
import { api } from '../../services/api'
// Shadcn
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Separator } from '../../../components/ui/separator'
import { Switch } from '../../../components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../components/ui/select'
// Lucide Icon
import {
	AlarmClock,
	CalendarDays,
	Image,
	MapPinned,
	NotebookText,
	Truck,
} from 'lucide-react'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
import SubscriptionGate from '../SubscriptionGate'

export default function StoreAccount() {
	const [editando, setEditando] = useState(false)
	const [form, setForm] = useState(null)
	const [estados, setEstados] = useState([])
	const [cidades, setCidades] = useState([])
	const [openDays, setOpenDays] = useState([])
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	const daysOfWeek = [
		{ label: 'Domingo', value: 0 },
		{ label: 'Segunda', value: 1 },
		{ label: 'Terça', value: 2 },
		{ label: 'Quarta', value: 3 },
		{ label: 'Quinta', value: 4 },
		{ label: 'Sexta', value: 5 },
		{ label: 'Sábado', value: 6 },
	]
	// estados
	useEffect(() => {
		axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((res) => {
			const ordenados = res.data.sort((a, b) => a.nome.localeCompare(b.nome))
			setEstados(ordenados)
		})
	}, [])
	// cidades
	useEffect(() => {
		if (form?.store_state) {
			axios
				.get(
					`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.store_state}/municipios`
				)
				.then((res) => {
					const ordenadas = res.data.sort((a, b) => a.nome.localeCompare(b.nome))
					setCidades(ordenadas)
				})
		}
	}, [form?.store_state])

	// Dias
	useEffect(() => {
		const fetchDias = async () => {
			try {
				const res = await api.get(`/store-day/all?fk_store_id=${fk_store_id}`)
				const data = res.data.data

				// Monta objeto ex: {0: {id: 1, is_open: false}, 1: {id: 3, is_open: true}, ...}
				const daysObj = data.reduce((acc, dia) => {
					acc[dia.weekday] = { id: dia.id, is_open: dia.is_open === 1 }
					return acc
				}, {})

				setOpenDays(daysObj)
			} catch (err) {
				console.error('Erro ao buscar dias de funcionamento:', err)
			}
		}

		if (fk_store_id) fetchDias()
	}, [fk_store_id])
	// Store info
	useEffect(() => {
		const fetchLoja = async () => {
			try {
				const res = await api.get(`/store/${fk_store_id}`)
				const store = res.data
				delete store.data.password
				setForm(store.data)
				// 🔹 Carrega as cidades se tiver store_state
				if (store.data.store_state) {
					const resCidades = await axios.get(
						`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${store.data.store_state}/municipios`
					)
					const ordenadas = resCidades.data.sort((a, b) => a.nome.localeCompare(b.nome))
					setCidades(ordenadas)
				}
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			}
		}
		if (fk_store_id) fetchLoja()
	}, [fk_store_id])
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}
	// CEP
	const handleCepChange = async (e) => {
		const cep = e.target.value.replace(/\D/g, '')
		setForm((prev) => ({ ...prev, store_zipcode: cep }))

		if (cep.length === 8) {
			try {
				const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
				const data = res.data
				if (!data.erro) {
					setForm((prev) => ({
						...prev,
						store_suburb: data.bairro,
						store_street: data.logradouro,
						store_city: data.localidade,
						store_state: data.uf,
					}))
				}
			} catch (error) {
				console.error('Erro ao buscar endereço pelo CEP:', error)
			}
		}
	}
	// Upload Image
	const handleImageChange = async (e) => {
		const file = e.target.files[0]
		if (!file) return

		try {
			const formData = new FormData()
			formData.append('imagem', file)

			const res = await api.post('/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			if (res.data?.url) {
				setForm((prev) => ({ ...prev, image: res.data.url }))
			}
		} catch (err) {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao atualizar imagem!',
					text: `${err}`,
				},
				1500
			)
		}
	}
	// Update Store
	const handleSalvar = async () => {
		try {
			const dadosAtualizados = {
				data: {
					name: form.name,
					email: form.email,
					image: form.image,
					minimum_order: Number(form.minimum_order),
					delivery_time_min: Number(form.delivery_time_min),
					delivery_time_max: Number(form.delivery_time_max),
					default_delivery_fee: Number(form.default_delivery_fee),
					store_street: form.store_street,
					store_number: form.store_number,
					store_suburb: form.store_suburb,
					store_city: form.store_city,
					store_state: form.store_state,
					store_zipcode: form.store_zipcode,
					open_time: formatTime(form.open_time),
					close_time: formatTime(form.close_time),
					subscription_status: form.subscription_status || 'inactive',
				},
			}

			await api.put(`/store/update/${fk_store_id}`, dadosAtualizados, {
				headers: { Authorization: `Bearer ${token}` },
			})
			// 🔁 Agora chama a função para salvar os dias
			await handleSalvarDias()

			showAlert(
				SuccessAlert,
				{
					title: 'Loja atualizada com sucesso!',
					text: 'O item foi atualizado.',
				},
				1500,
				() => (window.location.href = '/conta')
			)
			setEditando(false)
		} catch (error) {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao atualizar item!',
					text: 'O item não foi atualizado.',
				},
				1500
			)
		}
	}
	// Update Store Days
	const handleSalvarDias = async () => {
		try {
			// Filtra apenas os dias que foram alterados
			const diasAlterados = Object.entries(openDays).filter(([_, { isDirty }]) => isDirty)
			// Faz update só nos dias modificados
			for (const [weekday, { is_open }] of diasAlterados) {
				await api.post(
					`/store-day/upsert`,
					{ data: { weekday, is_open: is_open ? 1 : 0 }, fk_store_id },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			}
			// Atualiza estado local limpando os isDirty
			setOpenDays((prev) => {
				const updated = { ...prev }
				for (const [day] of diasAlterados) {
					updated[day] = { ...updated[day], isDirty: false }
				}
				return updated
			})
		} catch (err) {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao atualizar dias!',
					text: `${err}`,
				},
				1500
			)
		}
	}
	// format time
	function formatTime(time) {
		const [hours, minutes, seconds] = time.split(':')
		return `${hours}:${minutes}:${seconds || '00'}`
	}

	if (!form) return <div>Carregando...</div>

	return (
		<div className='max-w-full mx-auto md:px-8 px-4 py-12 space-y-6 border rounded-xl shadow bg-white'>
			<SubscriptionGate />
			{/* ===================== HEADER ===================== */}
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-bold'>Configurações da Loja</h2>
				<div className='space-x-2'>
					<Button
						onClick={() => setEditando(true)}
						className={`text-white ${editando ? 'bg-gray-400' : 'bg-yellow-500'}`}
						disabled={editando}
					>
						Editar
					</Button>
					<Button
						onClick={handleSalvar}
						className={`text-white ${editando ? 'bg-blue-500' : 'bg-gray-400'}`}
						disabled={!editando}
					>
						Salvar
					</Button>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{/* ===================== SEÇÃO: INFORMAÇÕES GERAIS ===================== */}
				<div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 border-1 rounded-xl md:p-6 p-4'>
					<div className='col-span-full'>
						<div className='text-lg font-bold mb-1 text-dulivi flex items-center gap-1'>
							<NotebookText size={20} class='text-dulivi' />
							<span className='small-caps text-xl'>Informações Gerais</span>
						</div>
						<Separator className={'my-2'} />
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='nome'>Nome da Loja</Label>
						<Input
							id='nome'
							name='name'
							value={form.name}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							name='email'
							type='email'
							value={form.email}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>
				</div>
				{/* ===================== SEÇÃO: HORÁRIOS ===================== */}
				<div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 border-1 rounded-xl md:p-6 p-4'>
					<div className='col-span-full'>
						<div className='text-lg font-bold mb-1 text-dulivi flex items-center gap-1'>
							<AlarmClock size={20} class='text-dulivi' />
							<span className='small-caps text-xl'>Horários</span>
						</div>
						<Separator className={'my-2'} />
					</div>

					<div className='flex flex-col gap-3'>
						<Label>Horário de abertura</Label>
						<Input
							type='time'
							value={form.open_time}
							onChange={(e) => setForm((p) => ({ ...p, open_time: e.target.value }))}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-3'>
						<Label>Horário de fechamento</Label>
						<Input
							type='time'
							value={form.close_time}
							onChange={(e) => setForm((p) => ({ ...p, close_time: e.target.value }))}
							disabled={!editando}
						/>
					</div>
				</div>
				{/* ===================== SEÇÃO: ENTREGA ===================== */}
				<div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 border-1 rounded-xl md:p-6 p-4'>
					<div className='col-span-full'>
						<div className='text-lg font-bold mb-1 text-dulivi flex items-center gap-1'>
							<Truck size={20} class='text-dulivi' />
							<span className='small-caps text-xl'>Entrega</span>
						</div>
						<Separator className={'my-2'} />
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Pedido Mínimo (R$)</Label>
						<Input
							name='minimum_order'
							type='number'
							value={form.minimum_order}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Taxa de Entrega (R$)</Label>
						<Input
							name='default_delivery_fee'
							type='number'
							value={form.default_delivery_fee}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Tempo Mínimo de Entrega (min)</Label>
						<Input
							name='delivery_time_min'
							type='number'
							value={form.delivery_time_min}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Tempo Máximo de Entrega (min)</Label>
						<Input
							name='delivery_time_max'
							type='number'
							value={form.delivery_time_max}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>
				</div>
				{/* ===================== SEÇÃO: ENDEREÇO ===================== */}
				<div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 border-1 rounded-xl md:p-6 p-4'>
					<div className='col-span-full'>
						<div className='text-lg font-bold mb-1 text-dulivi flex items-center gap-1'>
							<MapPinned size={20} className='text-dulivi' />
							<span className='small-caps text-xl'>Endereço</span>
						</div>
						<Separator className={'my-2'} />
					</div>

					<div className='flex flex-col gap-2'>
						<Label>CEP</Label>
						<Input
							name='store_zipcode'
							type='number'
							value={form.store_zipcode || ''}
							onChange={handleCepChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Estado</Label>
						<Select
							onValueChange={(v) => handleChange({ target: { name: 'store_state', value: v } })}
							value={form.store_state}
							disabled={!editando}
						>
							<SelectTrigger>
								<SelectValue placeholder='Selecione o estado' />
							</SelectTrigger>
							<SelectContent>
								{estados.map((e) => (
									<SelectItem key={e.id} value={e.sigla}>
										{e.nome}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Cidade</Label>
						<Select
							onValueChange={(v) => handleChange({ target: { name: 'store_city', value: v } })}
							value={form.store_city} // ✅ já pega do form
							disabled={!editando || !form.store_state}
						>
							<SelectTrigger>
								<SelectValue placeholder='Selecione a cidade' />
							</SelectTrigger>
							<SelectContent>
								{cidades.map((c) => (
									<SelectItem key={c.id} value={c.nome}>
										{c.nome}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Bairro</Label>
						<Input
							name='store_suburb'
							value={form.store_suburb}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Rua</Label>
						<Input
							name='store_street'
							value={form.store_street}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Número</Label>
						<Input
							name='store_number'
							type='number'
							value={form.store_number}
							onChange={handleChange}
							disabled={!editando}
						/>
					</div>
				</div>
				{/* ===================== SEÇÃO: IMAGEM ===================== */}
				<div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 border-1 rounded-xl md:p-6 p-4'>
					<div className='col-span-full'>
						<div className='text-lg font-bold mb-1 text-dulivi flex items-center gap-1'>
							<Image size={20} />
							<span className='small-caps text-xl'>Logo da empresa</span>
						</div>
						<Separator className={'my-2'} />
					</div>

					<div className='flex flex-col gap-2'>
						<div className='w-40 h-40 border rounded-xl overflow-hidden relative cursor-pointer group'>
							<input
								type='file'
								accept='image/*'
								onChange={handleImageChange}
								className='absolute inset-0 opacity-0 cursor-pointer z-10'
								disabled={!editando}
							/>
							<img
								src={form.image || '/assets/image.png'}
								alt='Logo da loja'
								className='w-full h-full object-cover group-hover:opacity-60 transition duration-200'
							/>
							{editando && (
								<div className='absolute inset-0 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition duration-200 bg-black/50'>
									Alterar
								</div>
							)}
						</div>
					</div>
				</div>
				{/* ===================== SEÇÃO: DIAS DE FUNCIONAMENTO ===================== */}
				<div className='col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 border-1 rounded-xl md:p-6 p-4'>
					<div className='col-span-full'>
						<div className='text-lg font-bold mb-1 text-dulivi flex items-center gap-1'>
							<CalendarDays size={20} />
							<span className='small-caps text-xl'>Dias de Funcionamento</span>
						</div>
						<Separator className={'my-2'} />
					</div>
					<div className='col-span-full'>
						<div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
							{daysOfWeek.map((day) => (
								<div
									key={day.value}
									className='flex items-center justify-between border rounded-lg px-3 py-2'
								>
									<span className='text-sm'>{day.label}</span>
									<Switch
										disabled={!editando}
										checked={openDays[day.value]?.is_open ?? false}
										onCheckedChange={(checked) =>
											setOpenDays((prev) => ({
												...prev,
												[day.value]: {
													...prev[day.value],
													id: prev[day.value]?.id ?? day.id, // garante que o id não se perca
													weekday: day.value, // útil pra identificar no backend
													is_open: checked,
													isDirty: true,
												},
											}))
										}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{alert}
		</div>
	)
}
