import { useState } from 'react'
import ComplementForm from './ComplementForm'
import ComplementList from './ComplementList'
import MenuTabs from '../MenuTabs'
import ComplementGroupForm from '../ComplementGroup/ComplementGroupForm'
import ComplementGroupList from '../ComplementGroup/ComplementGroupList'

export default function Complement() {
	const [activeTab, setActiveTab] = useState('Complementos')

	const tabs = ['Complementos', 'Cadastrar complemento', 'Grupos de complementos', 'Cadastrar grupos de complementos']

	return (
		<div>
			<MenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === 'Complementos' && <ComplementList />}
			{activeTab === 'Cadastrar complemento' && <ComplementForm />}
			{activeTab === 'Grupos de complementos' && <ComplementGroupList />}
			{activeTab === 'Cadastrar grupos de complementos' && <ComplementGroupForm />}
		</div>
	)
}
