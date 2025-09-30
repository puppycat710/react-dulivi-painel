import { useState } from 'react'
import { createPortal } from 'react-dom'

export function useAlert() {
	const [alert, setAlert] = useState(null)

	const showAlert = (Component, props, duration = 3000, callback) => {
		setAlert(<Component {...props} show={true} />)
		setTimeout(() => {
			setAlert(null)
			if (callback) callback()
		}, duration)
	}

	  return {
    alert: alert
      ? createPortal(alert, document.body) // joga pro body
      : null,
    showAlert
  }
}
