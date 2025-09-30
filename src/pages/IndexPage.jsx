import { useState } from 'react'
import HeaderMenu from '../components/HeaderMenu'
import SideMenu from '../components/SideMenu'
import PageRenderer from '../components/PageRenderer'

export default function IndexPage({ page }) {
  const [activePage, setActivePage] = useState(page)

  return (
    <section className='h-screen flex flex-col overflow-hidden'>
      <HeaderMenu />
      <div className='flex flex-1 overflow-hidden'>
        <SideMenu activePage={activePage} setActivePage={setActivePage} />
        <main className='flex-1 pt-[20px] px-[20px] overflow-y-auto relative'>
          <div className='px-3 pb-10'>
            <span className='text-4xl font-medium'>{activePage}</span>
            <div className='mt-6'>
              <PageRenderer activePage={activePage} />
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}
