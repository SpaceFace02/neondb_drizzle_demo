import { Chart } from './Chart'

export default async function Page() {
  try {
    let baseUrl
    if (!process.env.NEXT_PUBLIC_VERCEL_URL) {
      baseUrl = 'http://localhost:3000'
    } else {
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }
    const apiUrl = `${baseUrl}/api/`
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 10,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const { data } = await response.json()
    return (
      <>
        <Chart data={data} />
      </>
    )
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return <p>Failed to load data</p>
  }
}
