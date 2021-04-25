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
  const rootSchema = `
    type Cat{
      name: String
      color: String
    }
    input CatInput{
      name: String,
      color:String
    }
    type Employee{
      name: String,
      age: Int,
      designation: String,
      salary: Int,
      working: Boolean
    }
    type Query{
      myCat: Cat
      emp: Employee
    }
    type Mutation{
      newCat(input: CatInput!): Cat!
    }
    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        myCat() {
          return {
            name: 'Drake',
            color: 'White'
          }
        },

        emp() {
          return {
            name: 'John Doe',
            age: 24,
            designation: 'SWE',
            salary: 150000,
            working: true
          }
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
