
import { useState } from 'react'

function Settings() {
  const [cycleLength, setCycleLength] = useState(
    Number(localStorage.getItem('cycleLength')) || 28
  )
  const [periodLength, setPeriodLength] = useState(
    Number(localStorage.getItem('periodLength')) || 5
  )
  const [message, setMessage] = useState('')

  function saveSettings(e) {
    e.preventDefault()

    if (cycleLength < 15 || cycleLength > 60 ||
        periodLength < 1 || periodLength > 15) {
      setMessage('Please enter valid values.')
      return
    }

    localStorage.setItem('cycleLength', String(cycleLength))
    localStorage.setItem('periodLength', String(periodLength))
    setMessage('Settings saved successfully!')
  }

  function exportData() {
    const data = {
      lastPeriod: localStorage.getItem('lastPeriod'),
      cycleLength: localStorage.getItem('cycleLength'),
      periodLength: localStorage.getItem('periodLength'),
      periods: JSON.parse(localStorage.getItem('periods') || '[]'),
      symptoms: JSON.parse(
        localStorage.getItem('symptomEntries') || '[]'
      )
    }

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'luna-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function deleteData() {
    const confirmed = window.confirm(
      'Delete all saved cycle and symptom data? This cannot be undone.'
    )

    if (!confirmed) return

    const keys = [
      'lastPeriod',
      'cycleLength',
      'periodLength',
      'periods',
      'symptomEntries'
    ]

    keys.forEach((key) => localStorage.removeItem(key))

    setCycleLength(28)
    setPeriodLength(5)
    setMessage('All saved data has been deleted.')
  }

  return (
    <div>
      <h2>Settings ⚙️</h2>
      <p>Personalize your Luna experience.</p>

      <section>
        <h3>Cycle Preferences</h3>

        <form onSubmit={saveSettings}>
          <label htmlFor="settings-cycle">Cycle length (days)</label>
          <input
            id="settings-cycle"
            type="text"
            inputMode="numeric"
            min="15"
            max="60"
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
          />

          <label htmlFor="settings-period">Period duration (days)</label>
          <input
            id="settings-period"
            type="text"
            inputMode="numeric"
            min="1"
            max="15"
            value={periodLength}
            onChange={(e) => setPeriodLength(Number(e.target.value))}
          />

          <button type="submit">Save Settings</button>
        </form>

        {message && <p role="status">{message}</p>}
      </section>

      <section>
        <h3>Export My Data</h3>
        <p>Download your saved information as a JSON file.</p>
        <button onClick={exportData}>Export Data</button>
      </section>

      <section>
        <h3>Privacy & Data</h3>
        <p>
          Your cycle and symptom entries are stored locally
          in this browser, not in an online account.
        </p>
        <p>
          Anyone with access to this browser profile may be
          able to access the saved data.
        </p>

        <button
          className="delete-button"
          onClick={deleteData}
        >
          Delete All Data
        </button>
      </section>
    </div>
  )
}

export default Settings
