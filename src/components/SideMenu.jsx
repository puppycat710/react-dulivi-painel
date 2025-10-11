import SvgDelivery from '../components/svg/SvgDelivery'
import SvgOrder from '../components/svg/SvgOrder'
import SvgProduct from '../components/svg/SvgProduct'
import SvgHome from '../components/svg/SvgHome'
import SvgMessage from '../components/svg/SvgMessage'
import SvgStore from '../components/svg/SvgStore'

export default function SideMenu({ activePage, setActivePage }) {
	return (
		<aside className='bg-white w-[258px] min-h-[calc(100dvh-64px)] md:min-h-[calc(100vh-64px)] border-r-[1px] border-[#d9d9d9] md:block hidden'>
			<ul className='font-medium'>
				<li
					onClick={() => setActivePage('Início')}
					className={`group py-3 px-2 border-l-3 cursor-pointer ${
						activePage === 'Início'
							? 'bg-dulivi/10 border-dulivi text-dulivi'
							: 'border-transparent'
					}`}
				>
					<a className='flex items-center gap-2 group-hover:text-dulivi'>
						<SvgHome
							className={`w-[20px] h-[20px] ${
								activePage === 'Início' ? 'fill-dulivi' : 'group-hover:fill-dulivi'
							}`}
							width='20px'
							height='20px'
						/>
						Ínicio
					</a>
				</li>
				<li
					onClick={() => setActivePage('Pedidos')}
					className={`group py-3 px-2 border-l-3 cursor-pointer ${
						activePage === 'Pedidos'
							? 'bg-dulivi/10 border-dulivi text-dulivi'
							: 'border-transparent'
					}`}
				>
					<a className='flex items-center gap-2 group-hover:text-dulivi'>
						<SvgOrder
							className={`w-[20px] h-[20px] ${
								activePage === 'Pedidos' ? 'fill-dulivi' : 'group-hover:fill-dulivi'
							}`}
							width='20px'
							height='20px'
						/>
						Pedidos
					</a>
				</li>
				<li
					onClick={() => setActivePage('Produtos')}
					className={`group py-3 px-2 border-l-3 cursor-pointer ${
						activePage === 'Produtos'
							? 'bg-dulivi/10 border-dulivi text-dulivi'
							: 'border-transparent'
					}`}
				>
					<a className='flex items-center gap-2 group-hover:text-dulivi'>
						<SvgProduct
							className={`w-[20px] h-[20px] ${
								activePage === 'Produtos' ? 'fill-dulivi' : 'group-hover:fill-dulivi'
							}`}
							width='20px'
							height='20px'
						/>
						Produtos
					</a>
				</li>
				<li
					onClick={() => setActivePage('Delivery')}
					className={`group py-3 px-2 border-l-3 cursor-pointer ${
						activePage === 'Delivery'
							? 'bg-dulivi/10 border-dulivi text-dulivi'
							: 'border-transparent'
					}`}
				>
					<a className='flex items-center gap-2 group-hover:text-dulivi'>
						<SvgDelivery
							className={`w-[20px] h-[20px] ${
								activePage === 'Delivery' ? 'fill-dulivi' : 'group-hover:fill-dulivi'
							}`}
							width='20px'
							height='20px'
						/>
						Delivery
					</a>
				</li>
				<li
					onClick={() => setActivePage('Disparos')}
					className={`group py-3 px-2 border-l-3 cursor-pointer ${
						activePage === 'Disparos'
							? 'bg-dulivi/10 border-dulivi text-dulivi'
							: 'border-transparent'
					}`}
				>
					<a className='flex items-center gap-2 group-hover:text-dulivi'>
						<SvgMessage
							className={`w-[20px] h-[20px] ${
								activePage === 'Disparos' ? 'fill-dulivi' : 'group-hover:fill-dulivi'
							}`}
							width='20px'
							height='20px'
						/>
						Disparos
					</a>
				</li>
				<li
					onClick={() => setActivePage('Loja')}
					className={`group py-3 px-2 border-l-3 cursor-pointer ${
						activePage === 'Loja'
							? 'bg-dulivi/10 border-dulivi text-dulivi'
							: 'border-transparent'
					}`}
				>
					<a className='flex items-center gap-2 group-hover:text-dulivi'>
						<SvgStore
							className={`w-[22px] h-[22px] ${
								activePage === 'Loja' ? 'fill-dulivi' : 'group-hover:fill-dulivi'
							}`}
							width='22px'
							height='22px'
						/>
						Loja
					</a>
				</li>
			</ul>
		</aside>
	)
}
