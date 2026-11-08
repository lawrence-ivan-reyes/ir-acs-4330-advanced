export default async function seedIfEmpty({ Room, Plant }) {
  if (await Room.countDocuments()) return

  const rooms = await Room.create([
    { name: 'Living room', sunlight: 'Bright indirect' },
    { name: 'Bedroom', sunlight: 'Low' },
    { name: 'Kitchen', sunlight: 'Direct morning' }
  ])

  await Plant.create([
    {
      name: 'Monty',
      species: 'Monstera deliciosa',
      roomId: rooms[0].id,
      careEvents: [
        { kind: 'WATER', at: '2026-09-28T09:00:00.000Z' },
        { kind: 'FERTILIZE', note: 'Half strength', at: '2026-09-21T09:00:00.000Z' }
      ]
    },
    { name: 'Fig', species: 'Fiddle leaf fig', roomId: rooms[0].id },
    {
      name: 'Snake',
      species: 'Sansevieria',
      roomId: rooms[1].id,
      careEvents: [{ kind: 'WATER', at: '2026-09-14T09:00:00.000Z' }]
    },
    {
      name: 'Basil',
      species: 'Sweet basil',
      roomId: rooms[2].id,
      careEvents: [{ kind: 'WATER', at: '2026-10-03T08:00:00.000Z' }]
    }
  ])

  console.log('Seeded rooms and plants')
}
