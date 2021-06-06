import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Session } from 'next-auth'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

export interface UserSubscriptionSession  extends Session {
  activeSubscription?: any
}

type SessionProps = [UserSubscriptionSession, boolean]

export function SubscribeButton() {
  const [session]: SessionProps = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe') 

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })
    } catch(err) {
      alert(err.message)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}