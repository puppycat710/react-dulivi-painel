import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import MessageList from './MessageList'
import MessageForm from './MessageForm'
import GroupList from '../Group/GroupList'
import GroupForm from '../Group/GroupForm'
import ContatctList from '../Contact/ContatctList'
import ContactForm from '../Contact/ContactForm'

export default function Message() {
	const [activeTab, setActiveTab] = useState('Disparos')

	const tabs = ['Disparos', 'Cadastrar disparos', 'Contatos', 'Cadastrar contatos', 'Grupos', 'Cadastrar grupos']

	return (
		<div>
			<MenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === 'Disparos' && <MessageList />}
			{activeTab === 'Cadastrar disparos' && <MessageForm />}
			{activeTab === 'Contatos' && <ContatctList />}
			{activeTab === 'Cadastrar contatos' && <ContactForm />}
			{activeTab === 'Grupos' && <GroupList />}
			{activeTab === 'Cadastrar grupos' && <GroupForm />}
		</div>
	)
}
