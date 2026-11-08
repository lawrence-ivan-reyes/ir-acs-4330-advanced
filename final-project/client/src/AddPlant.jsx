import { useMutation } from '@apollo/client/react'
import { ADD_PLANT, GET_ROOMS } from './queries'

export default function AddPlant({ rooms, onAdded }) {
  const [addPlant, { loading, error }] = useMutation(ADD_PLANT, {
    refetchQueries: [GET_ROOMS]
  })

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const { name, species, roomId } = Object.fromEntries(new FormData(form))
    try {
      const { data } = await addPlant({
        variables: { name, species: species || null, roomId }
      })
      form.reset()
      onAdded(data.addPlant.id)
    } catch {
      // error below
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="label">New plant</p>
      <input name="name" placeholder="Name" required />
      <input name="species" placeholder="Species" />
      <select name="roomId">
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>
      <button className="go" disabled={loading}>
        {loading ? 'Adding…' : 'Add'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  )
}
