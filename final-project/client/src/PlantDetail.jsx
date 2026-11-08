import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PLANT, ADD_CARE_EVENT, DELETE_PLANT, NEW_EVENT, ME } from './queries'
import PlantArt, { CareIcon } from './PlantArt'

const KINDS = ['WATER', 'FERTILIZE', 'REPOT']

const date = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export default function PlantDetail({ id, onDeleted }) {
  const { data: meData } = useQuery(ME)
  const me = meData?.me
  const { data, loading, error } = useQuery(GET_PLANT, { variables: { id } })
  const [addCareEvent, careResult] = useMutation(ADD_CARE_EVENT, {
    update(cache, { data }) {
      const event = data.addCareEvent
      cache.modify({
        id: cache.identify({ __typename: 'Plant', id }),
        fields: {
          careEvents(existing = []) {
            const ref = cache.writeFragment({ data: event, fragment: NEW_EVENT })
            return [ref, ...existing]
          },
          lastWatered(current) {
            return event.kind === 'WATER' ? event.at : current
          }
        }
      })
    }
  })
  const [deletePlant, deleteResult] = useMutation(DELETE_PLANT, {
    update(cache, _result, { variables }) {
      cache.evict({
        id: cache.identify({ __typename: 'Plant', id: variables.id })
      })
      cache.gc()
    }
  })
  const actionError = careResult.error || deleteResult.error

  if (loading && !data) return <p className="empty">Loading…</p>
  if (error) return <p className="error">{error.message}</p>
  const plant = data?.plant
  if (!plant) return <p className="empty">Plant not found.</p>
  const canEdit = me && (me.role === 'admin' || plant.createdBy?.id === me.id)

  const handleDelete = () =>
    deletePlant({
      variables: { id },
      optimisticResponse: { deletePlant: true }
    }).then(onDeleted, () => {})

  function logCare(kind) {
    const at = new Date().toISOString()
    return addCareEvent({
      variables: { plantId: id, kind },
      optimisticResponse: {
        addCareEvent: {
          __typename: 'CareEvent',
          id: `temp-${Date.now()}`,
          kind,
          note: null,
          at,
        }
      }
    }).catch(() => {})
  }

  return (
    <div className="detail">
      <div>
        <p className="place">
          {plant.room.name}
          <span className="muted">{plant.room.sunlight}</span>
        </p>
        <h1>{plant.name}</h1>
        <p className="species">{plant.species ?? 'Unknown species'}</p>

        <ul>
          <li>
            <b>Last watered</b>
            {plant.lastWatered ? date(plant.lastWatered) : 'Never'}
          </li>
          {plant.careEvents.map((event) => (
            <li
              key={event.id}
              className={event.kind.toLowerCase()}
              style={{ opacity: String(event.id).startsWith('temp-') ? 0.5 : 1 }}
            >
              <CareIcon kind={event.kind} />
              <b>{date(event.at)}</b>
              {event.kind.toLowerCase()}
              {event.note && <span className="muted"> · {event.note}</span>}
            </li>
          ))}
        </ul>

        {canEdit && (
          <div className="actions">
            {KINDS.map((kind) => (
              <button key={kind} onClick={() => logCare(kind)}>
                <CareIcon kind={kind} />
                {kind.toLowerCase()}
              </button>
            ))}
            <button className="delete" onClick={handleDelete}>
              delete
            </button>
          </div>
        )}
        {actionError && <p className="error">{actionError.message}</p>}
      </div>
      <PlantArt id={id} size={240} />
    </div>
  )
}
