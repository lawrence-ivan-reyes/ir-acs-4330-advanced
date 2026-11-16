import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_PETS_CONNECTION } from './queries.js'

const SPECIES = ['', 'cat', 'dog', 'bird', 'rabbit', 'other']

export default function PetFeed() {
  const [species, setSpecies] = useState('')
  const { data, loading, error, fetchMore } = useQuery(GET_PETS_CONNECTION, {
    variables: { first: 10, species: species || null }
  })

  if (loading && !data) return <p>Loading…</p>
  if (error) return <p>{error.message}</p>

  const { edges, pageInfo } = data.petsConnection

  return (
    <section>
      <h2>Feed</h2>
      <select value={species} onChange={(e) => setSpecies(e.target.value)}>
        <option value="">all</option>
        {SPECIES.filter(Boolean).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <ul>
        {edges.map(({ node }) => (
          <li key={node.id}>
            {node.name} ({node.species})
          </li>
        ))}
      </ul>
      {pageInfo.hasNextPage && (
        <button
          onClick={() => fetchMore({ variables: { after: pageInfo.endCursor } })}
        >
          Load more
        </button>
      )}
    </section>
  )
}
