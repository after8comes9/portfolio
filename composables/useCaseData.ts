export interface CaseData {
  id: number
  title: string
  subtitle: string
  video: string
  color: string
}

export function useCaseData(): CaseData[] {
  return [
    {
      id: 1,
      title: 'Squid Game',
      subtitle: 'Telenet',
      video: 'https://cdn.stijnds.com/case1.mp4',
      color: '#c8ff00',
    },
    {
      id: 2,
      title: 'Vroege Vogels',
      subtitle: 'Doccle',
      video: 'https://cdn.stijnds.com/case2.mp4',
      color: '#00d4ff',
    },
    {
      id: 3,
      title: 'Base Pong',
      subtitle: 'Base',
      video: 'https://cdn.stijnds.com/case3.mp4',
      color: '#ff6b35',
    },
    {
      id: 4,
      title: 'Stream-Off',
      subtitle: 'Telenet',
      video: 'https://cdn.stijnds.com/case4.mp4',
      color: '#bf5af2',
    },
  ]
}
