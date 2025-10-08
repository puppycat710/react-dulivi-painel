import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from '../../components/ui/alert-dialog'
import { useState } from 'react'

export function ConfirmSwitch({ isActive, onConfirm, onCancel }) {
	const [loading, setLoading] = useState(false)
	const [localStatus, setLocalStatus] = useState(isActive)

	const handleConfirmClick = async () => {
		setLoading(true)
		try {
			await onConfirm() // chama o callback do pai
		} finally {
			setLoading(false)
		}
	}

	const handleCancelClick = () => {
		onCancel() // fecha sem mudar o status
	}

	return (
		<AlertDialog open={true}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{localStatus ? 'Fechar' : 'Abrir'} loja</AlertDialogTitle>
					<AlertDialogDescription>
						{localStatus
							? 'Fechar sua loja? Sua loja não receberá mais pedidos enquanto esta opção permanecer ativa.'
							: 'Reabrir sua loja? Sua loja voltará a receber pedidos assim que for reativada.'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={handleCancelClick} disabled={loading}>
						Cancelar
					</AlertDialogAction>
					<AlertDialogCancel onClick={handleConfirmClick} disabled={loading}>
						{loading ? 'Atualizando...' : 'Confirmar atualização'}
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
