
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function Calendar() {
  const [periods, setPeriods] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('periods')) || []
    } catch {
      return []
    }
  })

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]

  function changeMonth(amount) {
    setCurrentMonth(new Date(year, month + amount, 1))
  }

  function formatDate(day) {
    return [
      year,
      String(month + 1).padStart(2, '0'),
      String(day).padStart(2, '0')
    ].join('-')
  }

  function isPeriodDay(day) {
    if (!day) return false

    const date = formatDate(day)
    return periods.some(
      (period) => date >= period.start && date <= period.end
    )
  }

  const latestPeriod = [...periods].sort(
    (a, b) => b.start.localeCompare(a.start)
  )[0]

  const cycleLength = Number(
    localStorage.getItem('cycleLength')
  ) || 28

  const periodLength = Number(
    localStorage.getItem('periodLength')
  ) || 5

  function isPredictedDay(day) {
    if (!day || !latestPeriod) return false

    const date = new Date(formatDate(day) + 'T12:00:00')
    const start = new Date(latestPeriod.start + 'T12:00:00')
    const difference = Math.round((date - start) / 86400000)

    return difference >= cycleLength &&
      (difference - cycleLength) % cycleLength < periodLength
  }


  function addPeriod(e) {
    e.preventDefault()

    if (!startDate || !endDate) {
      alert('Please select both dates.')
      return
    }

    if (endDate < startDate) {
      alert('End date cannot be before start date.')
      return
    }

    const newPeriod = {
      id: Date.now(),
      start: startDate,
      end: endDate
    }

    const updated = [...periods, newPeriod].sort(
      (a, b) => b.start.localeCompare(a.start)
    )

    setPeriods(updated)
    localStorage.setItem('periods', JSON.stringify(updated))
    localStorage.setItem('lastPeriod', updated[0].start)

    setStartDate('')
    setEndDate('')
  }

  function deletePeriod(id) {
    const updated = periods.filter((period) => period.id !== id)
    setPeriods(updated)
    localStorage.setItem('periods', JSON.stringify(updated))

    if (updated.length > 0) {
      localStorage.setItem('lastPeriod', updated[0].start)
    } else {
      localStorage.removeItem('lastPeriod')
    }
  }

  return (
    <div>
      <h2>My Cycle Calendar 🌷</h2>
      <p>Record your period dates and view your cycle history.</p>

      <section className="calendar-section">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>
            <FaChevronLeft />
          </button>

          <h3>
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </h3>

          <button onClick={() => changeMonth(1)}>
            <FaChevronRight />
          </button>
        </div>

        <div className="calendar-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            .map((day) => (
              <div className="weekday" key={day}>
                {day}
              </div>
            ))}

          {calendarDays.map((day, index) => (
            <div
              key={day ? formatDate(day) : `empty-${index}`}
              className={[
                'calendar-day',
                isPeriodDay(day) ? 'period-day' : '',
                !isPeriodDay(day) && isPredictedDay(day)
                  ? 'predicted-day'
                  : ''
              ].join(' ')}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-legend">
          <span>🌸 Recorded period</span>
          <span>💜 Predicted period</span>
        </div>
      </section>
      <section>
        <h3>Add Period Dates</h3>

        <form onSubmit={addPeriod}>
          <label htmlFor="period-start">Start date</label>
          <input
            id="period-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label htmlFor="period-end">End date</label>
          <input
            id="period-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <button type="submit">Save Period 🌸</button>
        </form>
      </section>

      <section>
        <h3>Cycle History</h3>

        {periods.length === 0 ? (
          <p>No periods recorded yet.</p>
        ) : (
          periods.map((period) => (
            <div className="period-entry" key={period.id}>
              <p>
                🌸 {period.start} — {period.end}
              </p>

              <button
                type="button"
                onClick={() => deletePeriod(period.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export default Calendar
