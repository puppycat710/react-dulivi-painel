// components/DeleteButtonWithDialog.tsx
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogDescription,
} from '../../components/ui/alert-dialog'
import { Button } from '../../components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DeleteButtonWithDialog({ onConfirm }) {
	const [loading, setLoading] = useState(false)

	const handleClick = async () => {
		try {
			setLoading(true)
			await onConfirm()
		} finally {
			setLoading(false)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='ghost' size='icon' className='text-red-500 bg-red-100 hover:bg-red-200'>
					<Trash2 className='h-4 w-4' />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
					<AlertDialogDescription>Essa ação é irreversível. Todos os dados relacionados serão perdidos.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction disabled={loading}>Cancelar</AlertDialogAction>
					<AlertDialogCancel onClick={handleClick} disabled={loading}>
						{loading ? 'Excluindo...' : 'Confirmar exclusão'}
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
