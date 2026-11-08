import PlantArt from './PlantArt'

export default function PlantList({ rooms, selectedId, onSelect }) {
  return (
    <nav>
      {rooms.map((room) => (
        <div key={room.id}>
          <p className="label">{room.name}</p>
          {room.plants.map((plant) => (
            <button
              key={plant.id}
              className={plant.id === selectedId ? 'plant on' : 'plant'}
              onClick={() => onSelect(plant.id)}
            >
              <PlantArt id={plant.id} size={22} />
              {plant.name}
            </button>
          ))}
        </div>
      ))}
    </nav>
  )
}
