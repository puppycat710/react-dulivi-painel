import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound'
import LoginPage from './pages/LoginPage'
import PrivateRoute from './PrivateRoute'
import IndexPage from './pages/IndexPage'

export const RoutesComponent = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<LoginPage />} />
				<Route
					path='/'
					element={
						<PrivateRoute>
							<IndexPage page={'Pedidos'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/pedidos'
					element={
						<PrivateRoute>
							<IndexPage page={'Pedidos'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/produtos'
					element={
						<PrivateRoute>
							<IndexPage page={'Produtos'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/categorias'
					element={
						<PrivateRoute>
							<IndexPage page={'Categorias'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/delivery'
					element={
						<PrivateRoute>
							<IndexPage page={'Delivery'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/cidades'
					element={
						<PrivateRoute>
							<IndexPage page={'Cidades'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/disparos'
					element={
						<PrivateRoute>
							<IndexPage page={'Disparos'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/contatos'
					element={
						<PrivateRoute>
							<IndexPage page={'Contatos'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/grupos'
					element={
						<PrivateRoute>
							<IndexPage page={'Grupos'} />
						</PrivateRoute>
					}
				/>
				<Route
					path='/conta'
					element={
						<PrivateRoute>
							<IndexPage page={'Conta'} />
						</PrivateRoute>
					}
				/>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
