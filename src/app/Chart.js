'use client'
import React, { useState, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export const Chart = ({ data }) => {
  const [isPercentage, setIsPercentage] = useState(false)

  const processedData = useMemo(() => {
    const dateOrderStatusCount = {}

    data.forEach((order) => {
      const { order_date, order_item_status } = order
      // For each date, grouping the order status, like a map.
      if (!dateOrderStatusCount[order_date]) {
        dateOrderStatusCount[order_date] = {
          DELIVERED: 0,
          CANCELLED: 0,
          RETURNED: 0,
        }
      }
      dateOrderStatusCount[order_date][order_item_status] += 1
    })

    const dates = Object.keys(dateOrderStatusCount).sort()

    // List of delivered date, for the chart.
    const deliveredData = dates.map(
      (date) => dateOrderStatusCount[date].DELIVERED,
    )
    const cancelledData = dates.map(
      (date) => dateOrderStatusCount[date].CANCELLED,
    )
    const returnedData = dates.map(
      (date) => dateOrderStatusCount[date].RETURNED,
    )

    // For each day, getting the total number of orders, for calculating percentage.
    const totals = dates.map(
      (date) =>
        dateOrderStatusCount[date].DELIVERED +
        dateOrderStatusCount[date].CANCELLED +
        dateOrderStatusCount[date].RETURNED,
    )

    const dataFn = (data) => {
      if (isPercentage) {
        return data.map((value, index) => (value / totals[index]) * 100)
      }
      return data
    }

    // For percentage, I am calculating the total number of orders for each date.
    return {
      labels: dates,
      datasets: [
        {
          label: 'Delivered',
          data: dataFn(deliveredData),
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Cancelled',
          data: dataFn(cancelledData),
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Returned',
          data: dataFn(returnedData),
          backgroundColor: 'rgba(255, 206, 86, 1)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    }
  }, [isPercentage])

  return (
    <div style={{ width: '95vw', height: '90vh', position: 'relative' }}>
      <button
        className="px-5 py-2 bg-orange-600 text-white"
        onClick={() => setIsPercentage(!isPercentage)}
      >
        Switch to {isPercentage ? 'Absolute Numbers' : 'Percentages'}
      </button>
      <Bar
        data={processedData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
        }}
      />
    </div>
  )
}
