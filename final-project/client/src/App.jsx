import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_ROOMS, ME } from './queries'
import PlantList from './PlantList'
import AddPlant from './AddPlant'
import PlantDetail from './PlantDetail'
import Auth from './Auth'
import PlantShelf from './PlantShelf'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const { data: meData } = useQuery(ME)
  const me = meData?.me
  const { data, loading, error } = useQuery(GET_ROOMS)
  const rooms = data?.rooms ?? []

  return (
    <main>
      <aside>
        <button className="brand" onClick={() => setSelectedId(null)}>
          Plant journal
        </button>
        {loading && <p className="muted">Loading…</p>}
        {error && <p className="error">{error.message}</p>}
        <Auth />
        <PlantList rooms={rooms} selectedId={selectedId} onSelect={setSelectedId} />
        {me && <AddPlant rooms={rooms} onAdded={setSelectedId} />}
      </aside>
      <section>
        {selectedId ? (
          <PlantDetail id={selectedId} onDeleted={() => setSelectedId(null)} />
        ) : (
          <PlantShelf onSelect={setSelectedId} />
        )}
      </section>
    </main>
  )
}
