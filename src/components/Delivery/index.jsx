import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import DeliveryList from './DeliveryList'
import DeliveryForm from './DeliveryForm'
import CityList from '../City/CityList'
import CityForm from '../City/CityForm'

export default function Delivery() {
	const [activeTab, setActiveTab] = useState('Bairros')

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
