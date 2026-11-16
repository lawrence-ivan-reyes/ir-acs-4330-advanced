import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_PETS_PAGE } from './queries.js'

const PAGE_SIZE = 10

export default function PetPages() {
  const [page, setPage] = useState(0)
  const { data, previousData, loading, error } = useQuery(GET_PETS_PAGE, {
    variables: { limit: PAGE_SIZE, offset: page * PAGE_SIZE }
  })

  if (error) return <p>{error.message}</p>
  const result = (data ?? previousData)?.petsPage
  if (!result) return <p>Loading…</p>

  const totalPages = Math.ceil(result.total / PAGE_SIZE) || 1

  return (
    <section style={{ opacity: loading ? 0.5 : 1 }}>
      <h2>Pages</h2>
      <ul>
        {result.items.map((pet) => (
          <li key={pet.id}>
            {pet.name} ({pet.species})
          </li>
        ))}
      </ul>
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
        Prev
      </button>
      <span>
        {' '}
        Page {page + 1} of {totalPages}{' '}
      </span>
      <button onClick={() => setPage((p) => p + 1)} disabled={!result.hasMore}>
        Next
      </button>
    </section>
  )
}
