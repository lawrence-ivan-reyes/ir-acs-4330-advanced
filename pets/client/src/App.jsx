import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PETS, ADD_PET, UPDATE_PET, DELETE_PET, NEW_PET, ME } from './queries.js'
import Auth from './Auth.jsx'

export default function App() {
  const { data: meData } = useQuery(ME)
  const me = meData?.me
  const { data, loading, error } = useQuery(GET_PETS)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('cat')

  const [addPet, addResult] = useMutation(ADD_PET, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          pets(existing = []) {
            const ref = cache.writeFragment({
              data: data.addPet,
              fragment: NEW_PET
            })
            return [...existing, ref]
          }
        }
      })
    }
  })

  const [updatePet] = useMutation(UPDATE_PET)

  const [deletePet, deleteResult] = useMutation(DELETE_PET, {
    update(cache, _result, { variables }) {
      cache.evict({ id: cache.identify({ __typename: 'Pet', id: variables.id }) })
      cache.gc()
    }
  })

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addPet({
        variables: { name, species },
        optimisticResponse: {
          addPet: {
            __typename: 'Pet',
            id: `temp-${Date.now()}`,
            name,
            species,
            createdBy: me ? { __typename: 'User', id: me.id } : null
          }
        }
      })
      setName('')
    } catch {
      // addResult.error
    }
  }

  if (loading) return <p>Loading…</p>
  if (error) return <p>{error.message}</p>

  const actionError = addResult.error || deleteResult.error
  const canEdit = (pet) =>
    me && (me.role === 'admin' || pet.createdBy?.id === me.id)

  return (
    <main>
      <h1>Pets</h1>
      <Auth />
      {me && (
        <form onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <select value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option>cat</option>
            <option>dog</option>
            <option>bird</option>
            <option>rabbit</option>
            <option>other</option>
          </select>
          <button>Add</button>
        </form>
      )}
      {actionError && <p className="error">{actionError.message}</p>}
      <ul>
        {data.pets.map((pet) => (
          <li
            key={pet.id}
            style={{ opacity: String(pet.id).startsWith('temp-') ? 0.5 : 1 }}
          >
            {canEdit(pet) ? (
              <input
                defaultValue={pet.name}
                onBlur={(e) => {
                  const next = e.target.value.trim()
                  if (next && next !== pet.name) {
                    updatePet({ variables: { id: pet.id, name: next } })
                  }
                }}
              />
            ) : (
              <span>{pet.name}</span>
            )}
            <span>{pet.species}</span>
            {canEdit(pet) && (
              <button
                onClick={() =>
                  deletePet({
                    variables: { id: pet.id },
                    optimisticResponse: { deletePet: true }
                  }).catch(() => {})
                }
              >
                delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
