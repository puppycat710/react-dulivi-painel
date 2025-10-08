import { useEffect, useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Switch } from '../../components/ui/switch'
// SVG
import SvgUser from '../components/svg/SvgUser'
import SvgStatus from '../components/svg/SvgStatus'
import SvgLogo from '../components/svg/SvgLogo'
// Hooks
import { useAlert } from '../hooks/useAlert'
// API
import { api } from '../services/api'
import { ConfirmSwitch } from './ConfirmSwitch'

export default function HeaderMenu({ setActivePage }) {
	const [store, setStore] = useState(null)
	const [isActive, setIsActive] = useState(false)
	const [openDialog, setOpenDialog] = useState(false)
	// Alert
	const { alert, showAlert } = useAlert()
	// Session
	const fk_store_id = sessionStorage.getItem('fk_store_id')
	const token = sessionStorage.getItem('token')
	// Alterar status do estabeleciomento
	const handleChange = () => {
		setOpenDialog(true)
	}
	// Confirmar atualização
	const handleConfirm = async () => {
		// Atualiza o estado local e pega o novo valor
		let newIsActive
		setIsActive((prev) => {
			newIsActive = !prev // valor invertido
			return newIsActive
		})
		// Prepara os dados para o backend
		const dadosAtualizados = {
			data: {
				is_closed: newIsActive ? 0 : 1, // true → 0, false → 1
			},
		}
		// Atualiza no backend
		await api.put(`/store/update/${fk_store_id}`, dadosAtualizados, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		// Fecha o modal
		setOpenDialog(false)
		window.location.href = '/pedidos'
	}
	// Cancelar atualização
	const handleCancel = () => {
		setOpenDialog(false) // fecha o modal sem mudar status
		window.location.href = '/pedidos'
	}
	// Deslogar
	const handleLogout = () => {
		sessionStorage.removeItem('token')
		window.location.href = '/login'
	}
	// Busca dados da loja
	useEffect(() => {
		const fetchLoja = async () => {
			try {
				const res = await api.get(`/store/${fk_store_id}`)
				const data = res.data.data
				setStore(data)
				const now = new Date()
				const currentTime = now.toTimeString().split(' ')[0] // pega "HH:MM:SS"
				let isClosed = data.is_closed // valor atual do banco
				if (currentTime >= data.close_time || currentTime < data.open_time) {
					isClosed = 1 // fecha a loja
				}
				// Atualiza o isActive do frontend
				setIsActive(isClosed === 0)
			} catch (err) {
				showAlert(
					ErrorAlert,
					{
						title: 'Perfil não encontrado!',
						text: `${err}`,
					},
					1500
				)
			}
		}
		if (fk_store_id) fetchLoja()
	}, [fk_store_id])

	return (
		<>
			<header className='bg-white w-full h-[64px] px-4 flex items-center justify-between border-[1px] border-[#d9d9d9]'>
				<a href='/' className='flex items-center gap-1 cursor-pointer'>
					<SvgLogo className='fill-dulivi' width='24px' height='24px' />
					<span className='text-xl'>
						<span className='text-dulivi text-2xl font-extrabold'>Dulivi</span>&nbsp;.com.br
					</span>
				</a>
				<div className='flex items-center gap-6'>
					<DropdownMenu className='cursor-pointer font-medium'>
						<DropdownMenuTrigger>
							<div
								className={`flex items-center gap-2 border-1 px-3 py-1 rounded-md cursor-pointer ${
									isActive === true ? 'border-[#44CCAA]' : 'border-red-500'
								}`}
							>
								<div className='relative'>
									<div
										className={`absolute top-[9px] left-[11px] ${
											isActive === true ? 'bg-[#44CCAA]' : 'bg-red-500'
										} w-[7px] h-[7px] rounded-full`}
									></div>
									<SvgStatus fill='#7F8F9F' width='17px' height='17px' />
								</div>
								<span className='text-[#7f8f9f] text-sm font-semibold'>Aberto</span>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Status de funcionamento</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<div className='flex justify-between'>
									<div className='flex flex-col text-xs basis-2/3'>
										<span className='text-[#485460] font-medium'>Fechar estabeleciomento</span>
										<span className='text-[#7f8f9f]'>Interrompe o funcionamento da sua loja.</span>
									</div>
									<Switch checked={!isActive} onCheckedChange={handleChange} className={'cursor-pointer'} />
								</div>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className={'font-medium underline text-xs'} onClick={() => setActivePage('Loja')}>Configurar horários</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu className='cursor-pointer font-medium'>
						<DropdownMenuTrigger>
							<div className='flex items-center gap-3'>
								<span className='text-sm font-semibold'>{store?.name || ''}</span>
								{store?.image ? (
									<img src={store.image} alt='Logo da loja' className='w-12 h-12 rounded-full object-cover' />
								) : (
									<SvgUser className='bg-[#F3F3F3] rounded-full p-2' fill='#CCCCCC' width='50px' height='50px' />
								)}
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Minha conta</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className={'cursor-pointer'} onClick={() => setActivePage('Loja')}>
								Detalhes da loja
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} onClick={() => setActivePage('Loja')}>
								Detalhes do plano
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer text-red-500'} onClick={handleLogout}>
								Sair
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>
			{/* DIALOGO DE CONFIRMAÇÃO */}
			{openDialog && <ConfirmSwitch isActive={isActive} onConfirm={() => handleConfirm()} onCancel={handleCancel} />}
			{alert}
		</>
	)
}
