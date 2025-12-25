export interface Activity {
    id: string
    type: "purchase" | "mention" | "reward" | "follow"
    name: string
    avatar: string
    action: string
    message?: string
    amount?: number
    time: string
    artistId: string
    tokenName: string
    relatedTo: "artist" | "fan"
}

export interface Post {
    content: string
    time: string
    likes: number
    comments: number
    image?: string
    audioUrl?: string
    videoUrl?: string
}

export interface ExclusiveContent {
    title: string
    description: string
    date: string
}

export interface Reward {
    title: string
    description: string
    minTokens: number
    subscribers: number
}

export interface Certification {
    id: string
    type: "gold" | "platinum" | "views" | "soldout" | "award"
    title: string
    description: string
    date: string
}

export interface Artist {
    id: string
    name: string
    handle: string
    avatar: string
    description: string
    genre: string
    supporters: number
    blgReceived: number
    featured: boolean
    tokenName?: string
    tokenPrice?: number
    coverImage?: string
    posts?: Post[]
    exclusiveContent?: ExclusiveContent[]
    rewards?: Reward[]
    certifications?: Certification[]
}