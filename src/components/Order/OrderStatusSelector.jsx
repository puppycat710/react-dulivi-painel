export default function OrderStatusSelector({ setSelectedStatus, setShowConfirm }) {
	const statusLabels = {
		aceito: 'Aceitar',
		preparando: 'Preparar',
		entrega: 'Entregar',
		concluido: 'Concluir',
	}

		const handleClick = (status) => {
		setSelectedStatus(status)
		setShowConfirm(true)
	}

	return (
		<ul className='w-full text-white text-xs font-semibold flex flex-col items-center gap-1 py-2'>
			{Object.entries(statusLabels).map(([status, label]) => (
				<li key={status}>
					<button
						onClick={() => handleClick(status)}
						className={`px-2 py-1 rounded-full cursor-pointer ${
							status === 'aceito'
								? 'bg-indigo-500 hover:bg-indigo-500/80'
								: status === 'preparando'
								? 'bg-orange-500 hover:bg-orange-500/80'
								: status === 'entrega'
								? 'bg-sky-500 hover:bg-sky-500/80'
								: 'bg-emerald-500 hover:bg-emerald-500/80'
						}`}
					>
						{label}
					</button>
				</li>
			))}
		</ul>
	)
}
