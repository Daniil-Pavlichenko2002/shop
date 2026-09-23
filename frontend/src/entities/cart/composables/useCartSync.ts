import { useQueryClient } from '@tanstack/vue-query'
import { onMounted, onUnmounted } from 'vue'
import {
  applyCartLocally,
  type CartBroadcastChannel,
  createCartChannel,
} from '@/entities/cart'
import { useUserStore } from '@/entities/user'

export const useCartSync = () => {
  const queryClient = useQueryClient()
  let channel: BroadcastChannel | null = null

  onMounted(() => {
    channel = createCartChannel()

    channel?.addEventListener(
      'message',
      (event: MessageEvent<CartBroadcastChannel>) => {
        const payload = event.data
        if (payload.type !== 'cart-updated') return

        const currentUserId = useUserStore().user?.id ?? null

        if (payload.userId !== currentUserId) return

        applyCartLocally(queryClient, payload.cart)
      },
    )
  })

  onUnmounted(() => {
    channel?.close()
    channel = null
  })
}
