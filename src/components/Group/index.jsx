import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import GroupList from './GroupList'
import GroupForm from './GroupForm'
import MessageForm from '../Message/MessageForm'
import MessageList from '../Message/MessageList'
import ContatctList from '../Contact/ContatctList'
import ContactForm from '../Contact/ContactForm'

export default function Group() {
	const [activeTab, setActiveTab] = useState('Grupos')

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
