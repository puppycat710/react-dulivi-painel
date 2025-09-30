'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// Shadcn
import { Button } from '../../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../components/ui/form'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

const CitySchema = z.object({
	estado: z.string().min(1, { message: 'Selecione um estado.' }),
	cidade: z.string().min(1, { message: 'Selecione uma cidade.' }),
})

export default function CityForm() {
	const [estados, setEstados] = useState([])
	const [cidades, setCidades] = useState([])
	const { alert, showAlert } = useAlert()

	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')

	const form = useForm({
		resolver: zodResolver(CitySchema),
		defaultValues: {
			estado: '',
			cidade: '',
		},
	})

	const estadoSelecionado = form.watch('estado')
	// Carrega estados
	useEffect(() => {
		const fetchEstados = async () => {
			try {
				const res = await api.get('/estados')
				setEstados(res.data.data)
			} catch (error) {
				console.error('Erro ao carregar estados:', error)
			}
		}

		fetchEstados()
	}, [])
	// Carrega cidades quando muda estado
	useEffect(() => {
		const fetchCidades = async () => {
			if (estadoSelecionado) {
				try {
					const res = await api.get(`/cidades/${estadoSelecionado}`)
					setCidades(res.data.data)
				} catch (error) {
					console.error('Erro ao carregar cidades:', error)
				}
			}
		}

		fetchCidades()
	}, [estadoSelecionado])

	async function onSubmit(values) {
		try {
			const payload = {
				name: values.cidade,
				fk_store_id: Number(fk_store_id),
			}

			await api.post('/city/create', payload, {
				headers: { Authorization: `Bearer ${token}` },
			})

			showAlert(
				SuccessAlert,
				{
					title: 'Cadastrado com sucesso!',
					text: 'A cidade foi cadastrada.',
				},
				1500,
				() => (window.location.href = '/cidades')
			)
		} catch {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro ao cadastrar cidade!',
					text: 'Ocorreu um erro no cadastro.',
				},
				1500
			)
		}
	}

	return (
		<div className='max-w-full mx-auto p-6 border rounded-xl shadow bg-white'>
			<h1 className='text-2xl font-bold mb-4'>Cadastrar Cidade</h1>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					{/* Estado */}
					<FormField
						control={form.control}
						name='estado'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estado</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger id='estado'>
											<SelectValue placeholder='Selecione o estado' />
										</SelectTrigger>
										<SelectContent>
											{estados.map((e) => (
												<SelectItem key={e.id} value={String(e.id)}>
													{e.nome}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Escolha o estado da cidade.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Cidade */}
					<FormField
						control={form.control}
						name='cidade'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cidade</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value} disabled={!estadoSelecionado}>
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
								</FormControl>
								<FormDescription>Escolha a cidade que deseja cadastrar.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={() => form.reset()}>
							Cancelar
						</Button>
						<Button type='submit'>Cadastrar</Button>
					</div>
				</form>
			</Form>

			{alert}
		</div>
	)
}
