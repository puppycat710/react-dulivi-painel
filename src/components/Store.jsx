import { useEffect, useState } from 'react'
import axios from 'axios'
import { api } from '../services/api'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

export default function Store() {
	const [editando, setEditando] = useState(false)
	const [form, setForm] = useState(null)
	const [estados, setEstados] = useState([])
	const [cidades, setCidades] = useState([])
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	// Carrega estados no início
	useEffect(() => {
		axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((res) => {
			const ordenados = res.data.sort((a, b) => a.nome.localeCompare(b.nome))
			setEstados(ordenados)
		})
	}, [])

	// Carrega cidades quando muda estado
	useEffect(() => {
		if (form?.estado) {
			axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.estado}/municipios`).then((res) => {
				const ordenadas = res.data.sort((a, b) => a.nome.localeCompare(b.nome))
				setCidades(ordenadas)
			})
		}
	}, [form?.estado])

	// Busca dados da loja
	useEffect(() => {
		const fetchLoja = async () => {
			try {
				const res = await api.get(`/store/${fk_store_id}`)
				const store = res.data
				delete store.data.password
				setForm(store.data)
			} catch (err) {
				console.error('Erro ao buscar loja:', err)
			}
		}
		if (fk_store_id) fetchLoja()
	}, [fk_store_id])

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}
	const handleCepChange = async (e) => {
		const cep = e.target.value.replace(/\D/g, '')
		setForm((prev) => ({ ...prev, cep }))

		if (cep.length === 8) {
			try {
				const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
				const data = res.data
				if (!data.erro) {
					setForm((prev) => ({
						...prev,
						bairro: data.bairro,
						rua: data.logradouro,
						cidade: data.localidade,
						estado: data.uf,
					}))
				}
			} catch (error) {
				console.error('Erro ao buscar endereço pelo CEP:', error)
			}
		}
	}

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
				alert('Imagem atualizada!')
			}
		} catch (err) {
			console.error('Erro ao fazer upload da imagem:', err)
			alert('Erro ao enviar imagem.')
		}
	}

	const handleSalvar = async () => {
		try {
			// Montar endereço unificado para "store_location"
			const store_location = `${form.bairro} - ${form.cidade}`

			// Montar payload apenas com os campos aceitos
			const dadosAtualizados = {
				data: {
					name: form.name,
					email: form.email,
					image: form.image,
					minimum_order: Number(form.minimum_order),
					delivery_time_min: Number(form.delivery_time_min),
					delivery_time_max: Number(form.delivery_time_max),
					default_delivery_fee: Number(form.default_delivery_fee),
					store_location,
					subscription_status: form.subscription_status || 'inactive',
				},
			}

			await api.put(`/store/update/${fk_store_id}`, dadosAtualizados, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			alert('Loja atualizada com sucesso!')
			setEditando(false)
		} catch (error) {
			console.error('Erro ao salvar alterações:', error)
			alert('Erro ao salvar. Verifique os dados.')
		}
	}

	if (!form) return <div>Carregando...</div>

	return (
		<div className='max-w-full mx-auto p-4 space-y-6 border rounded-xl shadow bg-white'>
			<div className='flex justify-between items-center'>
				<h2 className='text-xl font-bold'>Dados da Loja</h2>
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

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='nome'>Nome da Loja</Label>
					<Input id='nome' name='name' value={form.name} onChange={handleChange} disabled={!editando} />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='email'>Email</Label>
					<Input id='email' name='email' type='email' value={form.email} onChange={handleChange} disabled={!editando} />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='pedido_minimo'>Pedido Mínimo (R$)</Label>
					<Input
						id='pedido_minimo'
						name='minimum_order'
						value={form.minimum_order}
						onChange={handleChange}
						disabled={!editando}
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='taxa_entrega'>Taxa de Entrega (R$)</Label>
					<Input
						id='taxa_entrega'
						name='default_delivery_fee'
						value={form.default_delivery_fee}
						onChange={handleChange}
						disabled={!editando}
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='tempo_entrega_min'>Tempo Mínimo de Entrega (min)</Label>
					<Input
						id='tempo_entrega_min'
						name='delivery_time_min'
						value={form.delivery_time_min}
						onChange={handleChange}
						disabled={!editando}
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='tempo_entrega_max'>Tempo Máximo de Entrega (min)</Label>
					<Input
						id='tempo_entrega_max'
						name='delivery_time_max'
						value={form.delivery_time_max}
						onChange={handleChange}
						disabled={!editando}
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='cep'>CEP</Label>
					<Input id='cep' name='cep' value={form.cep || ''} onChange={handleCepChange} disabled={!editando} />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='estado'>Estado</Label>
					<Select
						onValueChange={(value) => handleChange({ target: { name: 'estado', value } })}
						value={form.estado}
						disabled={!editando}
					>
						<SelectTrigger id='estado'>
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
					<Label htmlFor='cidade'>Cidade</Label>
					<Select
						onValueChange={(value) => handleChange({ target: { name: 'cidade', value } })}
						value={form.cidade}
						disabled={!editando || !form.estado}
					>
						<SelectTrigger id='cidade'>
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
					<Label htmlFor='bairro'>Bairro</Label>
					<Input id='bairro' name='bairro' value={form.bairro} onChange={handleChange} disabled={!editando} />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='rua'>Rua</Label>
					<Input id='rua' name='rua' value={form.rua} onChange={handleChange} disabled={!editando} />
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='numero'>Número</Label>
					<Input id='numero' name='numero' value={form.numero} onChange={handleChange} disabled={!editando} />
				</div>

				<div className='flex flex-col gap-2 w-full mt-6'>
					<Label>Imagem da Loja</Label>
					<div className='w-40 h-40 border rounded-xl overflow-hidden relative cursor-pointer group'>
						<input
							type='file'
							accept='image/*'
							onChange={(e) => handleImageChange(e)}
							className='absolute inset-0 opacity-0 cursor-pointer z-10'
							disabled={!editando}
						/>
						<img
							src={form.image || 'https://via.placeholder.com/160x160?text=Logo'}
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
		</div>
	)
}
