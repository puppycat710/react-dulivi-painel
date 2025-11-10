import { useState, useEffect } from 'react'
// Components
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
} from '../../../components/ui/dialog'
// Button
import { DeleteButtonWithDialog } from '../DeleteButtonWithDialog'
// SVG
import SvgEdit from '../svg/SvgEdit'
// Alert
import SuccessAlert from '../SuccessAlert'
import ErrorAlert from '../ErrorAlert'
import { useAlert } from '../../hooks/useAlert'
// API
import { api } from '../../services/api'

export function ProductActions({ product }) {
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ ...product })
	const [uploading, setUploading] = useState(false)
	const [categories, setCategories] = useState([])
	const [complementGroups, setComplementGroups] = useState([])
	const [selectedComplementGroups, setSelectedComplementGroups] = useState([])
	// alert
	const { alert, showAlert } = useAlert()
	// session
	const token = sessionStorage.getItem('token')
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	// Carregar grupos da loja
	useEffect(() => {
		async function fetchComplementGroups() {
			const res = await api.get(`/complement-group/all?fk_store_id=${fk_store_id}`)
			setComplementGroups(res.data)
		}
		fetchComplementGroups()
	}, [])
	// Carregar grupos do contato
	useEffect(() => {
		async function fetchComplementGroupProduct() {
			const res = await api.get(`/complement-group-products/all?fk_store_id=${fk_store_id}`)

			// pega todos vínculos desse contato
			const found = res.data.data
				.filter((cg) => cg.fk_product_id === product.id)
				.map((cg) => cg.fk_complement_group_id)

			setSelectedComplementGroups(found)
		}

		if (open) fetchComplementGroupProduct()
	}, [open])
	// alternar grupo
	const toggleGroup = (groupId) => {
		setSelectedComplementGroups((prev) =>
			prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
		)
	}
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]:
				name === 'price' || name.includes('weight') || name === 'servings'
					? Number(value)
					: value,
		}))
	}
	// load categories
	useEffect(() => {
		async function fecthCategories() {
			try {
				const res = await api.get(`/category/all?fk_store_id=${fk_store_id}`)
				setCategories(res.data.data)
			} catch (err) {
				showAlert(
					ErrorAlert,
					{
						title: 'Erro ao buscar categorias!',
						text: `${err}`,
					},
					1500
				)
			}
		}
		fecthCategories()
	}, [])
	// Image Upload
	const handleImageChange = async (e) => {
		const file = e.target.files[0]
		if (!file) return
		// lock button
		setUploading(true)
		try {
			const formData = new FormData()
			formData.append('imagem', file)
			// upload image to supabase
			const res = await api.post('/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			// add image url
			if (res.data?.url) {
				setForm((prev) => ({ ...prev, image: res.data.url }))
			}
		} catch {
			showAlert(
				ErrorAlert,
				{
					title: 'Erro no upload da imagem!',
					text: 'A imagem não foi cadastrada.',
				},
				1500
			)
		} finally {
			// unlock button
			setUploading(false)
		}
		;('')
	}
	// Update Product
	const handleUpdateProduct = async () => {
		const fieldMessages = {
			title: 'Nome do produto é obrigatório.',
			description: 'Descrição do produto é obrigatório.',
			weight_grams: 'Informe o peso.',
			servings: 'Informe quantas porções.',
			price: 'Informe o preço.',
		}
		for (const field in fieldMessages) {
			if (!form[field]) {
				showAlert(
					ErrorAlert,
					{
						title: 'Campo obrigatório',
						text: fieldMessages[field],
					},
					1500
				)
				return
			}
		}

		try {
			await api.put(
				`/product/update/${form.id}`,
				{ data: form },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			// Atualizar vínculo contato-grupo
			await api.post(
				`/complement-group-products/upsert`, // precisa já ter esse id carregado no form
				{
					fk_product_id: form.id,
					groups: selectedComplementGroups,
					fk_store_id: Number(fk_store_id),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			handleUpdateSuccess()
		} catch (err) {
			handleUpdateError()
		}
	}
	// Delete Product
	const handleDeleteProduct = async () => {
		try {
			await api.delete(`/product/delete/${form.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			handleDeleteSuccess?.()
		} catch {
			handleDeleteError?.()
		}
	}
	// Update Alert
	const handleUpdateSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Atualizado com sucesso!',
				text: 'O item foi atualizado.',
			},
			1500,
			() => (window.location.href = '/produtos')
		)
	}
	const handleUpdateError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao atualizar produto!',
				text: 'O item não foi atualizado.',
			},
			1500,
			() => (window.location.href = '/produtos')
		)
	}
	// Delete Alert
	const handleDeleteSuccess = () => {
		// Success
		showAlert(
			SuccessAlert,
			{
				title: 'Deletado com sucesso!',
				text: 'O item foi removido.',
			},
			1500,
			() => (window.location.href = '/produtos')
		)
	}
	const handleDeleteError = () => {
		// Error
		showAlert(
			ErrorAlert,
			{
				title: 'Erro ao deletar produto!',
				text: 'O item não foi removido.',
			},
			1500,
			() => (window.location.href = '/produtos')
		)
	}

	return (
		<>
			<div className='flex gap-2'>
				{/* edit button with dialog */}
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						{/* edit button */}
						<Button variant='outline' size='icon'>
							<SvgEdit className='w-4 h-4' />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[600px]'>
						<DialogHeader>
							<DialogTitle>Editar Produto</DialogTitle>
							<DialogDescription>
								Atualize os dados e clique em salvar para confirmar.
							</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='title'>Título:</Label>
								<Input
									name='title'
									placeholder='Título'
									value={form.title}
									onChange={handleChange}
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='description'>Descrição:</Label>
								<Textarea
									name='description'
									placeholder='Descrição'
									className='resize-none'
									value={form.description}
									onChange={handleChange}
								/>
							</div>
							<div className='flex gap-4 items-center w-full'>
								<div className='flex flex-col gap-2 w-full'>
									<Label htmlFor='price'>Preço:</Label>
									<Input
										name='price'
										placeholder='Preço'
										type='number'
										value={form.price}
										onChange={handleChange}
									/>
								</div>
								{/* Select de Categoria */}
								<div className='flex flex-col gap-2 w-full'>
									<Label htmlFor='category'>Categoria:</Label>
									<Select
										required
										value={form.fk_store_categories_id?.toString() || ''}
										onValueChange={(value) =>
											setForm((prev) => ({ ...prev, fk_store_categories_id: Number(value) }))
										}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Selecione uma categoria' />
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id.toString()}>
													{category.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className='flex gap-4 items-center w-full'>
								<div className='flex flex-col gap-2 w-full'>
									<Label htmlFor='weight_grams'>Peso (g):</Label>
									<Input
										name='weight_grams'
										placeholder='Peso (g)'
										type='number'
										value={form.weight_grams}
										onChange={handleChange}
									/>
								</div>
								<div className='flex flex-col gap-2 w-full'>
									<Label htmlFor='servings'>Porções:</Label>
									<Input
										name='servings'
										placeholder='Porções'
										type='number'
										value={form.servings}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='flex gap-4 items-start w-full'>
								{/* Select de Complementos */}
								<div className='flex flex-col gap-2 w-full'>
									<Label>Grupos de Complementos:</Label>
									<div className='flex flex-col gap-2 max-h-40 overflow-auto border rounded p-2'>
										{complementGroups.map((complementGroup) => (
											<div key={complementGroup.id} className='flex items-center gap-2'>
												<Checkbox
													checked={selectedComplementGroups.includes(complementGroup.id)}
													onCheckedChange={() => toggleGroup(complementGroup.id)}
												/>
												<span>{complementGroup.title}</span>
											</div>
										))}
									</div>
								</div>
								<div className='flex flex-col gap-2 w-full'>
									<Label htmlFor='image'>Imagem:</Label>
									<div className='w-40 h-40 border rounded-xl overflow-hidden relative cursor-pointer group'>
										<input
											type='file'
											accept='image/*'
											onChange={(e) => handleImageChange(e)}
											className='absolute inset-0 opacity-0 cursor-pointer z-10'
										/>
										<img
											src={form.image || '/assets/image.png'}
											alt='Logo da loja'
											className='w-full h-full object-cover group-hover:opacity-60 transition duration-200'
										/>
									</div>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button variant='outline' onClick={() => setOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateProduct} disabled={uploading}>
								{uploading ? 'Enviando...' : 'Salvar'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				{/* delete button with alert dialog */}
				<DeleteButtonWithDialog onConfirm={handleDeleteProduct} />
			</div>
			{alert}
		</>
	)
}
