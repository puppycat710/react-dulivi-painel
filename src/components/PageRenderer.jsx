// src/components/PageRenderer.jsx
import Home from './Home'
import Order from './Order'
import Product from './Product'
import Delivery from './Delivery'
import Store from './Store'
import Category from './Category'
import City from './City'
import Message from './Message'
import Group from './Group'
import Contact from './Contact'

export default function PageRenderer({ activePage }) {
	switch (activePage) {
		case 'Início':
			return <Home />
		case 'Pedidos':
			return <Order />
		case 'Produtos':
			return <Product />
		case 'Categorias':
			return <Category />
		case 'Delivery':
			return <Delivery />
		case 'Cidades':
			return <City />
		case 'Disparos':
			return <Message />
		case 'Contatos':
			return <Contact />
		case 'Grupos':
			return <Group />
		case 'Loja':
			return <Store />
		default:
			return <Order />
	}
}
