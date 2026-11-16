import mongoose from 'mongoose'
import 'dotenv/config'
import Pet from './models/Pet.js'

const names = ['Biscuit', 'Mochi', 'Pepper', 'Luna', 'Ziggy', 'Olive', 'Bean', 'Rex', 'Nala', 'Pickles']
const species = ['cat', 'dog', 'bird', 'rabbit', 'other']

await mongoose.connect(process.env.MONGO_URI)

if ((await Pet.countDocuments()) >= 50) {
  console.log('Already have enough pets')
  await mongoose.disconnect()
  process.exit(0)
}

const pets = Array.from({ length: 50 }, (_, i) => ({
  name: `${names[i % names.length]} ${i + 1}`,
  species: species[i % species.length],
  age: (i % 15) + 1
}))

await Pet.insertMany(pets)
console.log(`Inserted ${pets.length} pets`)
await mongoose.disconnect()
