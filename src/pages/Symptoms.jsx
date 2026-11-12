
import { useState } from 'react'

const symptomOptions = [
  'Cramps',
  'Headache',
  'Bloating',
  'Fatigue',
  'Back pain',
  'Breast tenderness',
  'Acne',
  'Nausea'
]

function Symptoms() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('symptomEntries')) || []
    } catch {
      return []
    }
  })

  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [mood, setMood] = useState('Okay')
  const [pain, setPain] = useState(0)
  const [notes, setNotes] = useState('')

  function toggleSymptom(symptom) {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    )
  }

  function saveEntry(e) {
    e.preventDefault()

    if (!date) {
      alert('Please select a date.')
      return
    }

    const newEntry = {
      id: Date.now(),
      date,
      symptoms: selectedSymptoms,
      mood,
      pain,
      notes
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('symptomEntries', JSON.stringify(updated))

    setSelectedSymptoms([])
    setMood('Okay')
    setPain(0)
    setNotes('')
  }

  function deleteEntry(id) {
    const updated = entries.filter((entry) => entry.id !== id)
    setEntries(updated)
    localStorage.setItem('symptomEntries', JSON.stringify(updated))
  }

  return (
    <div>
      <h2>Symptoms Tracker 🌸</h2>
      <p>Record how you feel throughout your cycle.</p>

      <section>
        <h3>New Symptom Entry</h3>

        <form onSubmit={saveEntry}>
          <label htmlFor="symptom-date">Date</label>
          <input
            id="symptom-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <h3>Symptoms</h3>

          <div className="symptom-options">
            {symptomOptions.map((symptom) => (
              <label className="symptom-choice" key={symptom}>
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => toggleSymptom(symptom)}
                />
                {symptom}
              </label>
            ))}
          </div>

          <label htmlFor="mood">Mood</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option>Happy</option>
            <option>Okay</option>
            <option>Sad</option>
            <option>Anxious</option>
            <option>Irritable</option>
            <option>Energetic</option>
          </select>

          <label htmlFor="pain">
            Pain level: {pain}/10
          </label>
          <input
            id="pain"
            type="range"
            min="0"
            max="10"
            value={pain}
            onChange={(e) => setPain(Number(e.target.value))}
          />

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today?"
          />

          <button type="submit">Save Entry 🌷</button>
        </form>
      </section>

      <section>
        <h3>Symptom History</h3>

        {entries.length === 0 ? (
          <p>No symptoms recorded yet.</p>
        ) : (
          entries.map((entry) => (
            <div className="symptom-entry" key={entry.id}>
              <h3>{entry.date}</h3>

              <p>
                <strong>Symptoms:</strong>{' '}
                {entry.symptoms.join(', ') || 'None'}
              </p>

              <p><strong>Mood:</strong> {entry.mood}</p>
              <p><strong>Pain:</strong> {entry.pain}/10</p>

              {entry.notes && (
                <p><strong>Notes:</strong> {entry.notes}</p>
              )}

              <button
                type="button"
                onClick={() => deleteEntry(entry.id)}
              >
                Delete Entry
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export default Symptoms
