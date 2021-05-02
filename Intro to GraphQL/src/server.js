import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const animalSchema = `
    interface Animal {
      species: String!
      location: String!
    }
  
    type Tiger implements Animal {
       species: String!
        location: String!
        stripesCount: Int
      }
    type Lion implements Animal {
      species: String!
      location: String!
      mainColor: String
     }
     type Query{
       animals: [Animal]!
     }
  `
  const rootSchema = ` 
    schema {
      query: Query
      mutation: Mutation
    }`
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [animalSchema],
    // typeDefs: [rootSchema, ...schemaTypes],
    // resolvers: merge({}, product, coupon, user),
    resolvers: {
      Query:{
        animals() {
          return[
            {species: 'Tiger', location: 'BL', stripesCount: 232},{species: 'Lion', location:'MH',mainColor:'yellow'}
          ] 
        }
      },
      Animal:{
        __resolveType(animal){
           return animal.species
        }
      }
    },
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
