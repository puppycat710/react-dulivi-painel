import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import ComplementForm from '../Complement/ComplementForm'
import ComplementList from '../Complement/ComplementList'
import ComplementGroupForm from './ComplementGroupForm'
import ComplementGroupList from './ComplementGroupList'

export default function ComplementGroup() {
	const [activeTab, setActiveTab] = useState('Grupos de complementos')

	const tabs = ['Complementos', 'Cadastrar complementos', 'Grupos de complementos', 'Cadastrar grupos de complementos']

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
