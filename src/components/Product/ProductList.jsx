'use client'

import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { ProductActions } from './ProductActions'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { ArrowUpDown } from 'lucide-react'

export default function ProductList() {
	const [products, setProducts] = useState([])
	const [filter, setFilter] = useState('')
	const [page, setPage] = useState(0)
	const [pageSize, setPageSize] = useState(5)

	// estados separados para ordenação
	const [sortTitleAsc, setSortTitleAsc] = useState(false)
	const [sortPriceAsc, setSortPriceAsc] = useState(false)

	const fk_store_id = sessionStorage.getItem('fk_store_id')

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await api.get(`/product/all?fk_store_id=${fk_store_id}`)
				if (response.data.success) {
					setProducts(response.data.data)
				}
			} catch (err) {
				console.error('Erro ao buscar produtos:', err)
			}
		}
		fetchProducts()
	}, [fk_store_id])

	// Filtragem + Ordenação
	let filteredProducts = products.filter((prod) =>
		[prod.title, prod.description].some((field) => field.toLowerCase().includes(filter.toLowerCase()))
	)
	// aplica ordenação por título OU por preço
	if (sortPriceAsc !== null) {
		filteredProducts = filteredProducts.sort((a, b) => (sortPriceAsc ? a.price - b.price : b.price - a.price))
	}
	if (sortTitleAsc !== null) {
		filteredProducts = filteredProducts.sort((a, b) =>
			sortTitleAsc
				? a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
				: b.title.localeCompare(a.title, undefined, { sensitivity: 'base' })
		)
	}
	// Paginação
	const totalRows = filteredProducts.length
	const start = page * pageSize
	const end = start + pageSize
	const paginatedProducts = filteredProducts.slice(start, end)

	return (
		<div>
			{/* Filtro e seleção de quantidade */}
			<div className='flex items-center justify-between py-4'>
				<Input
					placeholder='Filtrar produtos...'
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
							<TableHead>Peso</TableHead>
							<TableHead>Porções</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{paginatedProducts.map((prod) => (
							<TableRow key={prod.id}>
								<TableCell>
									<img src={prod.image} alt={prod.title} className='w-12 h-12 object-cover rounded' />
								</TableCell>
								<TableCell>{prod.title}</TableCell>
								<TableCell className='max-w-[250px] truncate'>{prod.description}</TableCell>
								<TableCell>R$ {prod.price.toFixed(2)}</TableCell>
								<TableCell>{prod.weight_grams}g</TableCell>
								<TableCell>{prod.servings}</TableCell>
								<TableCell>
									<ProductActions product={prod} />
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
						? 'Nenhum produto encontrado'
						: `Mostrando ${start + 1}–${Math.min(end, totalRows)} de ${totalRows} produto(s)`}
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
		</div>
	)
}
