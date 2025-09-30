import { useState } from 'react'
import ProductForm from '../Product/ProductForm'
import ProductList from '../Product/ProductList'
import MenuTabs from '../MenuTabs'
import CategoryList from './CategoryList'
import CategoryForm from './CategoryForm'

export default function Category() {
	const [activeTab, setActiveTab] = useState('Categorias')

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
