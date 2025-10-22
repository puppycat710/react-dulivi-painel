'use client'

import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { ComplementActions } from './ComplementActions'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { ArrowUpDown } from 'lucide-react'
// Alerts
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'

export default function ComplementList() {
	const [complements, setComplements] = useState([])
	// Table
	const [filter, setFilter] = useState('')
	const [page, setPage] = useState(0)
	const [pageSize, setPageSize] = useState(5)
	// estados separados para ordenação
	const [sortTitleAsc, setSortTitleAsc] = useState(false)
	const [sortPriceAsc, setSortPriceAsc] = useState(false)
	//Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	// Load COMPLEMENTS
	useEffect(() => {
		const fetchComplements = async () => {
			try {
				const response = await api.get(`/complement/all?fk_store_id=${fk_store_id}`)
				if (response.status === 200) {
					setComplements(response.data)
				}
			} catch (err) {
				console.error('Erro ao buscar complementos:', err)
			}
		}
		fetchComplements()
	}, [fk_store_id])
	// Filtragem + Ordenação
	let filteredComplements = complements.filter((comp) =>
		[comp.title, comp.description].some((field) => field.toLowerCase().includes(filter.toLowerCase()))
	)
	// aplica ordenação por título OU por preço
	if (sortPriceAsc !== null) {
		filteredComplements = filteredComplements.sort((a, b) => (sortPriceAsc ? a.price - b.price : b.price - a.price))
	}
	if (sortTitleAsc !== null) {
		filteredComplements = filteredComplements.sort((a, b) =>
			sortTitleAsc
				? a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
				: b.title.localeCompare(a.title, undefined, { sensitivity: 'base' })
		)
	}
	// Paginação
	const totalRows = filteredComplements.length
	const start = page * pageSize
	const end = start + pageSize
	const paginatedComplements = filteredComplements.slice(start, end)

	return (
		<div>
			{/* Filtro e seleção de quantidade */}
			<div className='flex items-center justify-between py-4'>
				<Input
					placeholder='Filtrar complementos...'
					value={filter}
					onChange={(e) => {
						setFilter(e.target.value)
						setPage(0)
					}}
					className='max-w-sm'
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>Mostrar: {pageSize}</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{[5, 10, 15, 20].map((size) => (
							<DropdownMenuItem
								key={size}
								onClick={() => {
									setPageSize(size)
									setPage(0)
								}}
							>
								{size} por página
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className='overflow-hidden rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Imagem</TableHead>
							{/* Ordenação por título */}
							<TableHead>
								<Button
									variant='ghost'
									className={'hover:bg-gray-300'}
									size='sm'
									onClick={() => {
										setSortTitleAsc(!sortTitleAsc)
										setSortPriceAsc(null) // zera ordenação de preço
									}}
								>
									Título
									<ArrowUpDown className='ml-2 h-4 w-4' />
								</Button>
							</TableHead>
							<TableHead className='max-w-[250px]'>Descrição</TableHead>
							{/* Ordenação por preço */}
							<TableHead>
								<Button
									variant='ghost'
									className={'hover:bg-gray-300'}
									size='sm'
									onClick={() => {
										setSortPriceAsc(!sortPriceAsc)
										setSortTitleAsc(null) // zera ordenação de título
									}}
								>
									Preço
									<ArrowUpDown className='ml-2 h-4 w-4' />
								</Button>
							</TableHead>
							<TableHead>Preço no Combo</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{paginatedComplements.map((comp) => (
							<TableRow key={comp.id}>
								<TableCell>
									<img src={comp.image} alt={comp.title} className='w-12 h-12 object-cover rounded' />
								</TableCell>
								<TableCell>{comp.title}</TableCell>
								<TableCell className='max-w-[250px] truncate'>{comp.description}</TableCell>
								<TableCell>{comp.price != null ? `R$ ${comp.price.toFixed(2)}` : 'Sem preço'}</TableCell>
								<TableCell>{comp.combo_surcharge != null ? `R$ ${comp.combo_surcharge.toFixed(2)}` : 'Sem preço'}</TableCell>
								<TableCell>
									<ComplementActions complement={comp} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Rodapé com paginação */}
			<div className='flex items-center justify-between py-4 text-sm text-muted-foreground'>
				<div>
					{totalRows === 0
						? 'Nenhum complemento encontrado'
						: `Mostrando ${start + 1}–${Math.min(end, totalRows)} de ${totalRows} complemento(s)`}
				</div>
				<div className='flex gap-2'>
					<Button variant='outline' size='sm' onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
						Anterior
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setPage((p) => (end < totalRows ? p + 1 : p))}
						disabled={end >= totalRows}
					>
						Próximo
					</Button>
				</div>
			</div>
			{alert}
		</div>
	)
}
