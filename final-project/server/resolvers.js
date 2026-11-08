import { GraphQLError } from 'graphql'

function badInput(message) {
  throw new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } })
}

async function requireRoom(Room, roomId) {
  if (!(await Room.exists({ _id: roomId }))) badInput(`No room with id ${roomId}`)
}

const waterAt = (plant) => {
  const event = [...plant.careEvents]
    .sort((a, b) => b.at - a.at)
    .find((item) => item.kind === 'WATER')
  return event ? event.at.toISOString() : null
}

const resolvers = {
  Query: {
    plants: (_, __, { Plant }) => Plant.find().exec(),
    plant: (_, { id }, { Plant }) => Plant.findById(id).exec(),
    rooms: (_, __, { Room }) => Room.find().exec(),
    room: (_, { id }, { Room }) => Room.findById(id).exec()
  },
  Mutation: {
    addRoom: (_, args, { Room }) => Room.create(args),
    addPlant: async (_, { name, species, roomId }, { Plant, Room }) => {
      await requireRoom(Room, roomId)
      return Plant.create({ name, species, roomId })
    },
    updatePlant: async (_, { id, name, species, roomId }, { Plant, Room }) => {
      const fields = {}
      if (name != null) fields.name = name
      if (species != null) fields.species = species
      if (roomId != null) {
        await requireRoom(Room, roomId)
        fields.roomId = roomId
      }
      return Plant.findByIdAndUpdate(id, fields, {
        returnDocument: 'after',
        runValidators: true
      }).exec()
    },
    deletePlant: async (_, { id }, { Plant }) => {
      const result = await Plant.findByIdAndDelete(id)
      return result !== null
    },
    addCareEvent: async (_, { plantId, kind, note }, { Plant }) => {
      const plant = await Plant.findById(plantId)
      if (!plant) badInput(`No plant with id ${plantId}`)
      plant.careEvents.push({ kind, note: note || null })
      await plant.save()
      return plant.careEvents.at(-1)
    }
  },
  Room: {
    plants: (room, _, { Plant }) => Plant.find({ roomId: room.id }).exec()
  },
  Plant: {
    room: (plant, _, { Room }) => Room.findById(plant.roomId).exec(),
    careEvents: (plant) =>
      [...plant.careEvents].sort((a, b) => b.at - a.at),
    lastWatered: waterAt
  },
  CareEvent: {
    at: (event) => event.at.toISOString(),
    plant: (event) => event.parent()
  }
}

export default resolvers
