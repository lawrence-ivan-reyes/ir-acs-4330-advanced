import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import { signToken, requireAuth, requireRole, requireOwnerOrAdmin } from './auth.js'

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

const encodeCursor = (id) => Buffer.from(String(id)).toString('base64')
const decodeCursor = (cursor) => Buffer.from(cursor, 'base64').toString('utf8')

const cap = (n) => Math.min(Math.max(n, 1), 50)

const resolvers = {
  Query: {
    me: (_, __, { user, User }) => (user ? User.findById(user.userId).exec() : null),
    pets: (_, __, { Pet }) => Pet.find().exec(),
    pet: (_, { id }, { Pet }) => Pet.findById(id).exec(),
    petsPage: async (_, { limit, offset }, { Pet }) => {
      const safeLimit = cap(limit)
      const [items, total] = await Promise.all([
        Pet.find().sort({ name: 1, _id: 1 }).skip(offset).limit(safeLimit).exec(),
        Pet.countDocuments()
      ])
      return { items, total, hasMore: offset + items.length < total }
    },
    petsConnection: async (_, { first, after, species }, { Pet }) => {
      const limit = cap(first)
      const filter = {}
      if (species) filter.species = species
      if (after) filter._id = { $gt: decodeCursor(after) }
      const docs = await Pet.find(filter).sort({ _id: 1 }).limit(limit + 1).exec()
      const hasNextPage = docs.length > limit
      const pets = docs.slice(0, limit)
      const edges = pets.map((pet) => ({
        node: pet,
        cursor: encodeCursor(pet.id)
      }))
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.at(-1)?.cursor ?? null
        }
      }
    },
    shelters: (_, __, { Shelter }) => Shelter.find().exec(),
    shelter: (_, { id }, { Shelter }) => Shelter.findById(id).exec()
  },
  Mutation: {
    register: (_, args, ctx) => authPayload(_, args, ctx, true),
    login: (_, args, ctx) => authPayload(_, args, ctx, false),
    addPet: (_, args, context) => {
      const user = requireAuth(context)
      return context.Pet.create({ ...args, createdBy: user.userId })
    },
    updatePet: async (_, { id, ...fields }, context) => {
      const pet = await context.Pet.findById(id)
      if (!pet) return null
      requireOwnerOrAdmin(context, pet)
      pet.set(fields)
      return pet.save()
    },
    deletePet: async (_, { id }, context) => {
      const pet = await context.Pet.findById(id)
      if (!pet) return false
      requireOwnerOrAdmin(context, pet)
      await pet.deleteOne()
      return true
    },
    addShelter: (_, args, context) => {
      requireRole(context, 'admin')
      return context.Shelter.create(args)
    },
    deleteShelter: async (_, { id }, context) => {
      requireRole(context, 'admin')
      const count = await context.Pet.countDocuments({ shelterId: id })
      if (count > 0) {
        throw new GraphQLError('Cannot delete a shelter that still has pets', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const result = await context.Shelter.findByIdAndDelete(id)
      return result !== null
    }
  },
  Pet: {
    shelter: (pet, _, { Shelter }) => {
      if (!pet.shelterId) return null
      return Shelter.findById(pet.shelterId).exec()
    },
    createdBy: (pet, _, { User }) =>
      pet.createdBy ? User.findById(pet.createdBy).exec() : null
  },
  Shelter: {
    pets: (shelter, _, { Pet }) => Pet.find({ shelterId: shelter.id }).exec()
  }
}

export default resolvers
