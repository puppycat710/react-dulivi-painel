import { useState } from 'react'
import MenuTabs from '../MenuTabs'
import ContatctList from './ContatctList'
import ContactForm from './ContactForm'
import MessageForm from '../Message/MessageForm'
import MessageList from '../Message/MessageList'
import GroupList from '../Group/GroupList'
import GroupForm from '../Group/GroupForm'

export default function Contact() {
	const [activeTab, setActiveTab] = useState('Contatos')

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
