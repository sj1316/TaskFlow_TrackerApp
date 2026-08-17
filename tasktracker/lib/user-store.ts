import type { User, AuthUser, LoginCredentials, SignupCredentials } from "./types"
import { authUtils } from "./auth"
import { UserModel, type UserDocument } from "./models/user"
import dbConnect from "./db"

export const userStore = {
  findByEmail: async (email: string): Promise<User | null> => {
    await dbConnect()
    const user = await UserModel.findOne({ email }).lean<UserDocument>()
    if (!user) return null
    
    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt
    }
  },

  findById: async (id: string): Promise<User | null> => {
    await dbConnect()
    const user = await UserModel.findById(id).lean<UserDocument>()
    if (!user) return null

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt
    }
  },

  create: async (userData: SignupCredentials): Promise<User> => {
    await dbConnect()
    const hashedPassword = await authUtils.hashPassword(userData.password)
    
    const newUser = await UserModel.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      createdAt: new Date().toISOString(),
    })

    return {
      id: newUser._id.toString(),
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      createdAt: newUser.createdAt
    }
  },

  authenticate: async (credentials: LoginCredentials): Promise<AuthUser | null> => {
    const user = await userStore.findByEmail(credentials.email)
    if (!user) return null

    const isValidPassword = await authUtils.comparePassword(credentials.password, user.password)
    if (!isValidPassword) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  },
}
