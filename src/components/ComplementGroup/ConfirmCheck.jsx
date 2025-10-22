import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from '../../../components/ui/alert-dialog'
import { useState } from 'react'

export function ConfirmCheck({ onConfirm, onCancel, description }) {
	const [loading, setLoading] = useState(false)

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
					<AlertDialogTitle>⚠️ Atenção!</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
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
