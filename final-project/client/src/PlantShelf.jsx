import { useQuery } from '@apollo/client/react'
import { GET_PLANTS_CONNECTION } from './queries'
import PlantArt from './PlantArt'

export default function PlantShelf({ onSelect }) {
  const { data, loading, error, fetchMore } = useQuery(GET_PLANTS_CONNECTION, {
    variables: { first: 6 }
  })

  if (loading && !data) return <p className="empty">Loading…</p>
  if (error) return <p className="error">{error.message}</p>

  const { edges, pageInfo } = data.plantsConnection

  return (
    <div className="welcome">
      <div className="shelf">
        {edges.map(({ node }) => (
          <button key={node.id} className="pot" onClick={() => onSelect(node.id)}>
            <PlantArt id={node.id} size={120} />
            {node.name}
          </button>
        ))}
      </div>
      {pageInfo.hasNextPage && (
        <button
          className="more"
          onClick={() => fetchMore({ variables: { after: pageInfo.endCursor } })}
        >
          Load more
        </button>
      )}
      <p className="empty">Pick a plant to see how it’s doing.</p>
    </div>
  )
}
