import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_ROOMS, ME } from './queries'
import PlantList from './PlantList'
import AddPlant from './AddPlant'
import PlantDetail from './PlantDetail'
import PlantArt from './PlantArt'
import Auth from './Auth'

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
          <div className="welcome">
            <div className="shelf">
              {rooms.flatMap((room) => room.plants).map((plant) => (
                <button key={plant.id} className="pot" onClick={() => setSelectedId(plant.id)}>
                  <PlantArt id={plant.id} size={120} />
                  {plant.name}
                </button>
              ))}
            </div>
            <p className="empty">Pick a plant to see how it’s doing.</p>
          </div>
        )}
      </section>
    </main>
  )
}
