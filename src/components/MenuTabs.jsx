import React from 'react'
import SvgAdd from './svg/SvgAdd'
import SvgList from './svg/SvgList'

export default function MenuTabs({ tabs = [], activeTab, setActiveTab }) {
	return (
		<div className='flex gap-4 border-b border-gray-200 mb-6'>
			{tabs.map((tab, index) => {
				const isPar = index % 2 === 0
				const Icon = isPar ? SvgList : SvgAdd

				return (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`flex items-center gap-2 py-2 px-4 border-b-2 text-sm font-medium transition-colors duration-200 group ${
							activeTab === tab ? 'border-dulivi text-dulivi' : 'border-transparent text-gray-950 hover:text-dulivi hover:border-dulivi'
						}`}
					>
						<Icon className={`w-4 h-4 ${
							activeTab === tab ? 'fill-dulivi' : 'fill-gray-950 group-hover:fill-dulivi'
						}`} />
						{tab}
					</button>
				)
			})}
		</div>
	)
}
