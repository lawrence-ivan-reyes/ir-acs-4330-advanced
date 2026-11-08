import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

export function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function getUserFromToken(authHeader = '') {
  const token = authHeader.replace('Bearer ', '')
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', {
      extensions: { code: 'UNAUTHENTICATED' }
    })
  }
  return context.user
}

export function requireRole(context, role) {
  const user = requireAuth(context)
  if (user.role !== role) {
    throw new GraphQLError('You do not have permission to do that', {
      extensions: { code: 'FORBIDDEN' }
    })
  }
  return user
}

export function requireOwnerOrAdmin(context, doc) {
  const user = requireAuth(context)
  const isOwner = doc.createdBy?.toString() === user.userId
  if (!isOwner && user.role !== 'admin') {
    throw new GraphQLError('You can only change your own records', {
      extensions: { code: 'FORBIDDEN' }
    })
  }
  return user
}
