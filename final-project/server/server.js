import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import 'dotenv/config'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import Room from './models/Room.js'
import Plant from './models/Plant.js'
import User from './models/User.js'
import seedIfEmpty from './seed.js'
import { getUserFromToken } from './auth.js'

await mongoose.connect(process.env.MONGO_URI)
console.log('Connected to MongoDB')
await seedIfEmpty({ Room, Plant })

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    user: getUserFromToken(req.headers.authorization),
    Room,
    Plant,
    User
  })
})

console.log(`Server ready at: ${url}`)
