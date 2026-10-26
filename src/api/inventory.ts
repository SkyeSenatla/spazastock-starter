import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { components } from './schema'
import { api, unwrap } from './clients'

export const inventoryKeys = 
{
  categories: ['categories'] as const,
  products: (categoryId: string) => ['products', categoryId] as const,
}

export function nextProductPageToken(page: components['schemas']['ProductPage']): string | undefined 
{
  return page.nextPageToken ?? undefined
}

export function useCategories() 
{
  return useQuery({
    queryKey: inventoryKeys.categories,
    queryFn: async () => unwrap(await api.GET('/api/v1/categories')),
    retry: false,
  })
}

export function useCategoryProducts(categoryId: string | null) 
{
  return useInfiniteQuery({
    queryKey: inventoryKeys.products(categoryId ?? ''),
    enabled: categoryId !== null,
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      if (!categoryId) throw new Error('Choose a category to view its products.')

      return unwrap(await api.GET('/api/v1/categories/{id}/products', 
        {
          params: {
            path: { id: categoryId },
            query: {
              pageSize: 6,
              pageToken: pageParam,
            },
          },
        }),
      )
    },
    getNextPageParam: nextProductPageToken,
    retry: false,
  })
}
