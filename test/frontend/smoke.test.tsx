import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfilePage from '../../app/profile/page'
import ActivityPage from '../../app/activity/page'

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}))

// Mock Privy
vi.mock('@privy-io/react-auth', () => ({
    usePrivy: () => ({
        login: vi.fn(),
        authenticated: true,
        ready: true,
    }),
    useWallets: () => ({
        wallets: [{ address: '0x123' }],
    }),
}))

// Mock custom hooks
vi.mock('@/hooks/use-auth', () => ({
    useAuth: () => ({
        balance: 0,
        donated: 0,
        userData: { username: 'testuser', isVerified: false },
        isArtist: () => true,
        logout: vi.fn(),
    }),
}))

// Mock API calls
vi.mock('@/lib/alchemy', () => ({
    getUserRewards: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/lib/api/posts', () => ({
    getUserPosts: vi.fn().mockResolvedValue([]),
}))

test('ProfilePage renders without crashing', () => {
    render(<ProfilePage />)
    expect(screen.getByText('iamjuampi')).toBeDefined()
})

test('ActivityPage renders without crashing', () => {
    render(<ActivityPage />)
    expect(screen.getByText('Activity')).toBeDefined()
})
