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
      age: Int
      owner:Owner!
    }
    type Owner{
      name: String
      cat: Cat!
    }
    type Query2{
      cat(name:String): Cat!
      owner(name:String): Owner!
    }
    schema {
      query: Query2
      mutation: Mutation
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema, ...schemaTypes],
    // resolvers: merge({}, product, coupon, user),
    resolvers: {
      Query2: {
        cat(_,args){
          return {}
        },
        owner(_,args){
          return {}
        }
      },
      Cat:{
        name(){
          return 'Garfield'
        },
        age(){
          return 5
        },
        owner(){
          return{}
        }
      },
      Owner:{
        name(){
          return 'Joe'
        },
        cat(){
          return{}
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
