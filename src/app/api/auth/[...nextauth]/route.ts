import {NextAuthOptions} from "next-auth"
import { Adapter } from "next-auth/adapters"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { prisma } from "@/app/lib/db/prisma"
import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth/next"
import { env } from "@/app/lib/env"

export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter (prisma) as Adapter,
providers: [ 
    GoogleProvider({
clientId: env.GOOGLE_CLIENT_ID,
clientSecret: env.GOOGLE_CLIENT_SECRET,

}),
],

callbacks:{
    session({session, user}) {
session.user.id = user.id
return session;
    },
},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}