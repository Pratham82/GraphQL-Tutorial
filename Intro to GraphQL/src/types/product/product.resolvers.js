import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'
import userResolvers from '../user/user.resolvers'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const products = (_,args,ctx) => {
  if(!ctx.user){
    throw new AuthenticationError
  }
  return Product.find({}).exec()
}
const product  = (_,args,ctx) => {
  if(!ctx.user){
    throw new AuthenticationError
  }
  return Product.findById({_id:args.id}).exec()
}
const newProduct = (_,args,ctx) =>{
  if(!ctx.user || ctx.user.role != 'admin'){
    throw new AuthenticationError
  }
  return Product.create({...args.input, createdBy: ctx.user._id})
}
const updateProduct = (_, args,ctx) =>{
  if(!ctx.user || ctx.user.role != 'admin'){
    throw new AuthenticationError
  }
  return Product.findByIdAndUpdate(args.id , args.input, {new:true}).exec()
}
const removeProduct = (_,args,ctx) => {
  if(!ctx.user || ctx.user.role != 'admin'){
    throw new AuthenticationError
  }
  return Product.findByIdAndDelete(args.id).lean().exec()
}
export default {
  Query: {
    products,
    product,
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {
      return productsTypeMatcher[product.type]
    },
    createdBy(product) {
      return User.findById(product.createdBy)
    }
  }
}
