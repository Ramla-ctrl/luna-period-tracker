
import { useState } from 'react'

function Dashboard() {
  const [lastPeriod, setLastPeriod] = useState(
    localStorage.getItem('lastPeriod') || ''
  )
  const [cycleLength, setCycleLength] = useState(
    Number(localStorage.getItem('cycleLength')) || 28
  )
  const [periodLength, setPeriodLength] = useState(
    Number(localStorage.getItem('periodLength')) || 5
  )

  const [saved, setSaved] = useState(false)

  function saveCycle() {
    if (!lastPeriod) {
      alert('Please select your last period date.')
      return
    }

    localStorage.setItem('lastPeriod', lastPeriod)
    localStorage.setItem('cycleLength', cycleLength)
    localStorage.setItem('periodLength', periodLength)
    setSaved(true)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = lastPeriod
    ? new Date(lastPeriod + 'T00:00:00')
    : null

  const difference = startDate
    ? Math.floor((today - startDate) / 86400000)
    : null

  const cycleDay = difference !== null && difference >= 0
    ? (difference % cycleLength) + 1
    : null

  const nextPeriod = startDate
    ? new Date(
        startDate.getTime() +
        (Math.floor(Math.max(difference, 0) / cycleLength) + 1) *
        cycleLength * 86400000
      )
    : null

  return (
    <div>
      <h2>Welcome to Luna 🌸</h2>
      <p>Your personal menstrual cycle tracker.</p>

      <section>
        <h3>My Cycle</h3>

        <label>Last period start date</label>
        <input
          type="date"
          value={lastPeriod}
          max={today.toLocaleDateString('en-CA')}
          onChange={(e) => {
            setLastPeriod(e.target.value)
            setSaved(false)
          }}
        />

        <label>Average cycle length (days)</label>
        <input
          type="number"
          min="15"
          max="60"
          value={cycleLength}
          onChange={(e) => {
            setCycleLength(Number(e.target.value))
            setSaved(false)
          }}
        />

        <label>Period duration (days)</label>
        <input
          type="number"
          min="1"
          max="15"
          value={periodLength}
          onChange={(e) => {
            setPeriodLength(Number(e.target.value))
            setSaved(false)
          }}
        />

        <button onClick={saveCycle}>
          Save Cycle
        </button>

        {saved && <p>✅ Your cycle has been saved!</p>}
      </section>

      {cycleDay && (
        <section>
          <h3>Current Cycle</h3>
          <h2>Day {cycleDay}</h2>
          <p>Average cycle: {cycleLength} days</p>
          <p>Period duration: {periodLength} days</p>
        </section>
      )}

      {nextPeriod && (
        <section>
          <h3>Next Period 🌷</h3>
          <h2>
            {nextPeriod.toLocaleDateString('en-GB')}
          </h2>
          <p>
            Estimated next period start date.
          </p>
          <small>
            Predictions are estimates and may vary.
          </small>
        </section>
      )}
    </div>
  )
}

export default Dashboard
