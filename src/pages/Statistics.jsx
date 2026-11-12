
import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

function Statistics() {
  const [periods] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('periods')) || []
    } catch {
      return []
    }
  })

  const [symptoms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('symptomEntries')) || []
    } catch {
      return []
    }
  })

  const sortedPeriods = [...periods].sort(
    (a, b) => a.start.localeCompare(b.start)
  )

  const cycleData = sortedPeriods.slice(1).map((period, index) => {
    const previous = new Date(sortedPeriods[index].start + 'T12:00:00')
    const current = new Date(period.start + 'T12:00:00')

    return {
      cycle: `Cycle ${index + 1}`,
      days: Math.round((current - previous) / 86400000)
    }
  })

  const averageCycle = cycleData.length
    ? Math.round(
        cycleData.reduce((sum, item) => sum + item.days, 0) /
        cycleData.length
      )
    : null

  const averagePain = symptoms.length
    ? (
        symptoms.reduce((sum, item) => sum + item.pain, 0) /
        symptoms.length
      ).toFixed(1)
    : null

  return (
    <div>
      <h2>My Cycle Statistics 📊</h2>
      <p>Understand your cycle patterns over time.</p>

      <section>
        <h3>Cycle Overview</h3>
        <p>Recorded periods: {periods.length}</p>
        <p>
          Average cycle length: {averageCycle ?? 'Not enough data'}
          {averageCycle !== null && ' days'}
        </p>
        <p>
          Average pain level: {averagePain ?? 'Not enough data'}
          {averagePain !== null && '/10'}
        </p>
      </section>

      <section>
        <h3>Cycle Length History</h3>

        {cycleData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cycle" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="days"
                  stroke="#a34570"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>Record at least two periods to see your cycle chart.</p>
        )}
      </section>
    </div>
  )
}

export default Statistics
