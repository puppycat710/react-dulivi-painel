import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import StoreAccount from './StoreAccount'
import StorePayment from './StorePayment'

export default function Store() {
	const [activeTab, setActiveTab] = useState('Conta')

	const tabs = ['Conta', 'Ativar Pagamento']

	return (
		<div>
			<MenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === 'Conta' && <StoreAccount />}
			{activeTab === 'Ativar Pagamento' && <StorePayment />}
		</div>
	)
}
