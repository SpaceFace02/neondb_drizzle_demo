import { Chart } from './Chart'

export default async function Page() {
  try {
    const baseUrl = 'https://moneyflo-takehome.vercel.app'
    const apiUrl = `${baseUrl}/api/`
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 10,
      },
    })
    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to fetch data')
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
