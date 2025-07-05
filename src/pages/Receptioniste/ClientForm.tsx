// ClientForm.tsx
import { useState } from 'react'
import axios from 'axios'

export default function ClientForm() {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await axios.post('/api/clients', form)
    alert(res.data.message || 'Client enregistré')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nom" onChange={e => setForm({ ...form, nom: e.target.value })} />
      <input placeholder="Téléphone" onChange={e => setForm({ ...form, telephone: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <button type="submit">Enregistrer Client</button>
    </form>
  )
}
