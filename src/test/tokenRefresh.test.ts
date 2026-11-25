import { beforeEach, describe, expect, it, vi } from 'vitest'
import { refreshAccessToken } from '../shared/api/tokenRefresh'

const { mockPost, mockGetCookie } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGetCookie: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: mockPost,
    }),
  },
}))

vi.mock('../utils/cookies', () => ({
  getCookie: mockGetCookie,
}))

beforeEach((): void => {
  vi.clearAllMocks()
})

describe('Access Token Refresh', () => {
  it('returns null when the CSRF cookie is missing', async () => {
    mockGetCookie.mockReturnValue(null)

    const result = await refreshAccessToken()

    expect(result).toBeNull()
    expect(mockPost).not.toHaveBeenCalled()
  })

  it('refreshes the access token when the CSRF cookie exists', async () => {
    mockGetCookie.mockReturnValue('csrf123')

    mockPost.mockResolvedValue({
      data: {
        access_token: 'new-access-token',
      },
    })

    const result = await refreshAccessToken()

    expect(mockGetCookie).toHaveBeenCalledWith('csrf_refresh_token')

    expect(mockPost).toHaveBeenCalledWith(
      '/auth/refresh',
      {},
      {
        headers: {
          'X-CSRF-TOKEN': 'csrf123',
        },
      },
    )

    expect(result).toBe('new-access-token')
  })
})
