import { useState } from 'react'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import MenuTabs from '../MenuTabs'
import CategoryList from '../Category/CategoryList'
import CategoryForm from '../Category/CategoryForm'

export default function Product() {
	const [activeTab, setActiveTab] = useState('Produtos')

	const tabs = ['Produtos', 'Cadastrar produto', 'Categorias', 'Cadastrar categoria']

	return (
		<div>
			<MenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === 'Produtos' && <ProductList />}
			{activeTab === 'Cadastrar produto' && <ProductForm />}
			{activeTab === 'Categorias' && <CategoryList />}
			{activeTab === 'Cadastrar categoria' && <CategoryForm />}
		</div>
	)
}
