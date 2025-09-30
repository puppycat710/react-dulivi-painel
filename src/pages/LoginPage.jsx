import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import SvgLogo from '../components/svg/SvgLogo'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleLogin = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const response = await api.post('/store/login', {
				email,
				password,
			})

			const { success, data: store_data } = response.data

			if (!success || !store_data?.token) {
				return alert('Credenciais inválidas.')
			}

			sessionStorage.setItem('token', store_data.token)
			sessionStorage.setItem('fk_store_id', store_data.id)
			navigate('/pedidos')
		} catch (error) {
			console.error('Erro ao logar:', error.response?.data || error.message)
			alert('Erro ao tentar fazer login.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className='size-full h-screen flex items-center justify-center'>
			<div className='w-full flex flex-col items-center gap-6 max-w-[400px]'>
				<div className='flex items-center gap-2 text-3xl'>
					<aside className='flex items-center gap-2'>
						<SvgLogo className="fill-dulivi" width='33px' height='33px' />
						<span className='text-dulivi font-extrabold'>Dulivi</span>
					</aside>
					<h2 className='text-[#6E6F71]'>Login</h2>
				</div>
				<form className='w-full flex flex-col gap-5 bg-white rounded-md border-[1px] border-[#DADCE0] p-6 shadow-xl' onSubmit={handleLogin}>
					<div className='w-full flex flex-col gap-2'>
						<label for='email' className='text-sm text-[#6E6F71] font-semibold'>
							Email
						</label>
						<input
							type='email'
							placeholder='email@example.com'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full rounded-md border-[1px] border-[#DADCE0] focus:border-dulivi focus:outline-none px-2 py-1.5'
							required
						/>
					</div>
					<div className='w-full flex flex-col gap-2'>
						<label for='password' className='text-sm text-[#6E6F71] font-semibold'>
							Senha
						</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full rounded-md border-[1px] border-[#DADCE0] focus:border-dulivi focus:outline-none px-2 py-1.5'
							required
						/>
					</div>
					<button className='w-full bg-dulivi hover:bg-dulivi/80 active:dulivi/90 text-white font-bold border border-dulivi rounded-lg py-1.5 shadow-xl' type='submit' disabled={loading}>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</form>
				<div className='ml-auto px-8 text-[13px] text-[#6E6F71]'>©️ 2025 Dulivi</div>
			</div>
		</section>
	)
}
