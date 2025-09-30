import { useState } from 'react'
// Components
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/dialog'
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
	// Alert
	const { alert, showAlert } = useAlert()
	// Token for api
	const token = sessionStorage.getItem('token')
	// Change Input
	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: name === 'price' || name.includes('weight') || name === 'servings' ? Number(value) : value,
		}))
	}
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
							<DialogDescription>Atualize os dados e clique em salvar para confirmar.</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='title'>Título:</Label>
								<Input name='title' placeholder='Título' value={form.title} onChange={handleChange} />
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='description'>Descrição:</Label>
								<Textarea name='description' placeholder='Descrição' className='resize-none' value={form.description} onChange={handleChange} />
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='price'>Preço:</Label>
								<Input name='price' placeholder='Preço' type='number' value={form.price} onChange={handleChange} />
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='weight_grams'>Peso (g):</Label>
								<Input name='weight_grams' placeholder='Peso (g)' type='number' value={form.weight_grams} onChange={handleChange} />
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='servings'>Porções:</Label>
								<Input name='servings' placeholder='Porções' type='number' value={form.servings} onChange={handleChange} />
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='image'>Imagem:</Label>
								<div className='w-40 h-40 border rounded-xl overflow-hidden relative cursor-pointer group'>
									<input type='file' accept='image/*' onChange={(e) => handleImageChange(e)} className='absolute inset-0 opacity-0 cursor-pointer z-10' />
									<img src={form.image || '/assets/image.png'} alt='Logo da loja' className='w-full h-full object-cover group-hover:opacity-60 transition duration-200' />
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
