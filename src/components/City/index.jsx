import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import CityList from './CityList'
import CityForm from './CityForm'
import DeliveryForm from '../Delivery/DeliveryForm'
import DeliveryList from '../Delivery/DeliveryList'
export default function City() {
	const [activeTab, setActiveTab] = useState('Cidades')

	const tabs = ['Bairros', 'Cadastrar bairro', 'Cidades', 'Cadastrar cidade']

	return (
		<div>
			<MenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === 'Bairros' && <DeliveryList />}
			{activeTab === 'Cadastrar bairro' && <DeliveryForm />}
			{activeTab === 'Cidades' && <CityList />}
			{activeTab === 'Cadastrar cidade' && <CityForm />}
		</div>
	)
}
