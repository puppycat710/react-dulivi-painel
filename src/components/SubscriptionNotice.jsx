import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import axios from 'axios'
import { api } from '../services/api.js'

export default function SubscriptionNotice() {
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState(null)

  const fk_store_id = sessionStorage.getItem('fk_store_id')
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get(
          `https://cardapio-digital-api-nzm1.onrender.com/subscriptions/${fk_store_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const subscription = res.data
        // 🔴 SEM ASSINATURA (API retorna { error: ... })
        if (!subscription || subscription.error || !subscription.status) {
          await api.put(
            `/store/update/${fk_store_id}`,
            { data: { is_closed: 1 } },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          setStatus('none')
          setShow(true)
          return
        }

        const subStatus = subscription.status
        // ✅ ATIVA
        if (subStatus === 'authorized') {
          await api.put(
            `/store/update/${fk_store_id}`,
            { data: { is_closed: 0 } },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setShow(false)
          return
        }
        // ⏸️ / ❌
        if (subStatus === 'paused' || subStatus === 'cancelled') {
          await api.put(
            `/store/update/${fk_store_id}`,
            { data: { is_closed: 1 } },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setStatus(subStatus)
          setShow(true)
        }
      } catch (err) {
        // 🔴 ERRO = SEM ASSINATURA (404 normalmente)
        console.warn('Assinatura não encontrada')
        await api.put(
          `/store/update/${fk_store_id}`,
          { data: { is_closed: 1 } },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setStatus('none')
        setShow(true)
      }
    }

    checkSubscription()
  }, [fk_store_id, token])

  if (!show) return null

  const isPaused = status === 'paused'
  const isCancelled = status === 'cancelled'
  const noSubscription = status === 'none'

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-700">
          Assinatura inativa
        </span>

        <Badge variant="destructive">
          {isPaused && 'Pausada'}
          {isCancelled && 'Cancelada'}
          {noSubscription && 'Inexistente'}
        </Badge>
      </div>

      <p className="text-sm text-gray-600">
        {isPaused && (
          <>Sua assinatura está pausada. Reative para continuar usando o sistema.</>
        )}

        {isCancelled && (
          <>Sua assinatura foi cancelada. É necessário assinar novamente.</>
        )}

        {noSubscription && (
          <>Você ainda não possui uma assinatura ativa. Escolha um plano para começar.</>
        )}
      </p>

      {(isPaused) && (
        <Button
          onClick={() => (window.location.href = '/meu-plano')}
          className="w-full"
        >
          Ativar assinatura
        </Button>
      )}

      {(isCancelled || noSubscription) && (
        <Button
          onClick={() => (window.location.href = '/planos')}
          className="w-full"
        >
          Assinar novamente
        </Button>
      )}
    </div>
  )
}
