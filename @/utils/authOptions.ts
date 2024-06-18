import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/db/prisma";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { env } from "@/app/lib/env";
import { mergeAnonymousCart } from "@/app/lib/db/carts";
import {   PrismaClient } from "@prisma/client";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
    ],
  
    callbacks: {
      async session({ session, user }) {
        //fetch the user's role from the database
        const dbUser = await prisma.user.findUnique({
          where: {id:user.id},
        })

        if(dbUser) { 
        session.user.id = user.id;
       session.user.role = dbUser.role
      }
      return session;
    },
    },
    events: {
      async signIn({ user }) {
        await mergeAnonymousCart(user.id);
      },
    },
  };