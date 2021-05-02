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

const products = () => {
  return Product.find({}).exec()
}
const product  = (_,args) => {
  return Product.findById({_id:args.id}).exec()
}
const newProduct = (_,args,ctx) =>{
  return Product.create({...args.input, createdBy: ctx.user._id})
}
const updateProduct = (_, args) =>{
  return Product.findByIdAndUpdate(args.id , args.input, {new:true}).lean().exec()
}
const removeProduct = (_,args) => {
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
    __resolveType(product) {},
    createdBy(product) {
      return User.findById(product.createdBy)
    }
  }
}
