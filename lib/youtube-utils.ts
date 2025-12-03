export function extractYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return url

  // Parameters to hide YouTube UI elements and enable API control
  const params = new URLSearchParams({
    autoplay: "1",
    loop: "1",
    playlist: videoId, // Required for loop to work
    controls: "0",
    modestbranding: "1",
    showinfo: "0",
    rel: "0",
    fs: "0",
    disablekb: "1",
    iv_load_policy: "3",
    enablejsapi: "1", // Enable JavaScript API for play/pause control
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
