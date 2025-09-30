import { useEffect, useState } from 'react'
// SVG
import SvgUser from '../components/svg/SvgUser'
import SvgStatus from '../components/svg/SvgStatus'
import SvgLogo from '../components/svg/SvgLogo'
// Hooks
import { useAlert } from '../hooks/useAlert'
// API
import { api } from '../services/api'

export default function HeaderMenu() {
	const [store, setStore] = useState(null)
	const { alert, showAlert } = useAlert()
	const fk_store_id = sessionStorage.getItem('fk_store_id')
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
				const response = res.data
				setStore(response.data)
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
					<div className='flex items-center gap-2 border-1 border-[#44CCAA] px-3 py-1 rounded-md cursor-pointer'>
						<div className='relative'>
							<div className='absolute top-[9px] left-[11px] bg-[#44CCAA] w-[7px] h-[7px] rounded-full'></div>
							<SvgStatus fill='#7F8F9F' width='17px' height='17px' />
						</div>
						<span className='text-[#7f8f9f] text-sm font-semibold'>Aberto</span>
					</div>
					<div onClick={handleLogout} className='flex items-center gap-3 cursor-pointer'>
						<span className='text-sm font-semibold'>{store?.name || ''}</span>
						{store?.image ? (
							<img src={store.image} alt='Logo da loja' className='w-12 h-12 rounded-full object-cover' />
						) : (
							<SvgUser className='bg-[#F3F3F3] rounded-full p-2' fill='#CCCCCC' width='50px' height='50px' />
						)}
					</div>
				</div>
			</header>
			{alert}
		</>
	)
}
