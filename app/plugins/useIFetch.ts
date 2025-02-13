import { defu } from 'defu'
import type { UseFetchOptions } from '#app'
import token from '~/composables/token'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: useIFetch
    }
  }
})

const baseURL = process.env.API ?? 'http://localhost:7000/api/'

export async function useIFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const defaults: UseFetchOptions<T> = {
    baseURL,
    key: url,
    headers: token.value.access
      ? { Authorization: `Bearer ${token.value.access}` }
      : {},
    onResponse: async ({ response, options }) => {
      if (response.status === 401) {
        try {
          if (!token.value.refresh) return await useRouter().push(useLocalePath()(`/login?next=${useRoute().path}`))
          const newToken = await refreshToken()
          if (!newToken) return await useRouter().push(useLocalePath()(`/login?next=${useRoute().path}`))
          token.value.access = newToken

          options.headers = { Authorization: `Bearer ${newToken}` }
          useFetch(url, options as UseFetchOptions<T>)
        } catch (error) {
          console.error('Token refresh failed:', error)
        }
      }
      return response
    }
  }

  const params = defu(options, defaults)

  return useFetch(url, params)
}

async function refreshToken() {
  const refreshToken = useCookie('refreshToken')

  const { data, status } = await useFetch<{ access: string }>(
    `${baseURL}oauth/refresh/`,
    {
      method: 'POST',
      body: { refresh: refreshToken.value }
    }
  )

  if (status.value === 'success') {
    return data.value?.access
  } else {
    await useRouter().push(useLocalePath()(`/login?next=${useRoute().path}`))
    throw new Error('Token refresh failed')
  }
}
