import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

export default function ErrorAlert({ title, text, show }) {
	return (
		<div className='fixed top-20 left-1/2 transform -translate-x-1/2 z-[99999]'>
			<div className={`transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
				<Alert variant='destructive' className='bg-red-100 w-fit'>
					<AlertCircleIcon />
					<AlertTitle>{ title }</AlertTitle>
					<AlertDescription>{ text }</AlertDescription>
				</Alert>
			</div>
		</div>
	)
}
