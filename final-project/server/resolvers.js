import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import { signToken, requireAuth, requireRole, requireOwnerOrAdmin } from './auth.js'

function badInput(message) {
  throw new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } })
}

async function requireRoom(Room, roomId) {
  if (!(await Room.exists({ _id: roomId }))) badInput(`No room with id ${roomId}`)
}

async function authPayload(_, { email, password }, { User }, isRegister) {
  if (isRegister) {
    if (password.length < 8) {
      throw new GraphQLError('Password must be at least 8 characters', {
        extensions: { code: 'BAD_USER_INPUT' }
      })
    }
    if (await User.findOne({ email })) {
      throw new GraphQLError('Email already in use', {
        extensions: { code: 'BAD_USER_INPUT' }
      })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const role = (await User.countDocuments()) === 0 ? 'admin' : 'user'
    const user = await User.create({ email, passwordHash, role })
    return { token: signToken(user), user }
  }

  const user = await User.findOne({ email })
  const valid = user && (await bcrypt.compare(password, user.passwordHash))
  if (!valid) {
    throw new GraphQLError('Invalid email or password', {
      extensions: { code: 'UNAUTHENTICATED' }
    })
  }
  return { token: signToken(user), user }
}

const waterAt = (plant) => {
  const event = [...plant.careEvents]
    .sort((a, b) => b.at - a.at)
    .find((item) => item.kind === 'WATER')
  return event ? event.at.toISOString() : null
}

const resolvers = {
  Query: {
    me: (_, __, { user, User }) => (user ? User.findById(user.userId).exec() : null),
    plants: (_, __, { Plant }) => Plant.find().exec(),
    plant: (_, { id }, { Plant }) => Plant.findById(id).exec(),
    rooms: (_, __, { Room }) => Room.find().exec(),
    room: (_, { id }, { Room }) => Room.findById(id).exec()
  },
  Mutation: {
    register: (_, args, ctx) => authPayload(_, args, ctx, true),
    login: (_, args, ctx) => authPayload(_, args, ctx, false),
    addRoom: (_, args, context) => {
      requireRole(context, 'admin')
      return context.Room.create(args)
    },
    addPlant: async (_, { name, species, roomId }, context) => {
      const user = requireAuth(context)
      await requireRoom(context.Room, roomId)
      return context.Plant.create({ name, species, roomId, createdBy: user.userId })
    },
    updatePlant: async (_, { id, name, species, roomId }, context) => {
      const plant = await context.Plant.findById(id)
      if (!plant) return null
      requireOwnerOrAdmin(context, plant)
      if (roomId != null) await requireRoom(context.Room, roomId)
      plant.set({
        ...(name != null && { name }),
        ...(species != null && { species }),
        ...(roomId != null && { roomId })
      })
      return plant.save()
    },
    deletePlant: async (_, { id }, context) => {
      const plant = await context.Plant.findById(id)
      if (!plant) return false
      requireOwnerOrAdmin(context, plant)
      await plant.deleteOne()
      return true
    },
    addCareEvent: async (_, { plantId, kind, note }, context) => {
      const plant = await context.Plant.findById(plantId)
      if (!plant) badInput(`No plant with id ${plantId}`)
      requireOwnerOrAdmin(context, plant)
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
    lastWatered: waterAt,
    createdBy: (plant, _, { User }) =>
      plant.createdBy ? User.findById(plant.createdBy).exec() : null
  },
  CareEvent: {
    at: (event) => event.at.toISOString(),
    plant: (event) => event.parent()
  }
}

export default resolvers
