import { useState } from 'react'
import HeaderMenu from '../components/HeaderMenu'
import SideMenu from '../components/SideMenu'
import PageRenderer from '../components/PageRenderer'
import PaymentNotice from '../components/PaymentNotice'

export default function IndexPage({ page }) {
	const [activePage, setActivePage] = useState(page)

	return (
		<section className='h-screen flex flex-col overflow-hidden'>
			<HeaderMenu setActivePage={setActivePage} />
			<div className='flex flex-1 overflow-hidden'>
				<SideMenu activePage={activePage} setActivePage={setActivePage} />
				<PaymentNotice />
				<main className='flex-1 md:p-5 p-0 overflow-y-auto relative'>
					<div className='px-3 pb-10'>
						{/* <span className='text-2xl font-bold small-caps underline text-dulivi'>{activePage}</span> */}
						<div className='mt-0 6'>
							<PageRenderer activePage={activePage} />
						</div>
					</div>
				</main>
			</div>
		</section>
	)
}
