import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Import your database client/ORM
import dbConnect from "./mongoose"; // Adjust import path
import User from "@/app/models/user";

console.log("🔧 Loading auth configuration...");
console.log("Environment:", process.env.NODE_ENV);
console.log("VERCEL:", !!process.env.VERCEL);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          // Check if user exists in your database
          let dbUser = await User.findOne({
            email: user.email,
          });
          
          // If th user does not exist Create a new user in your database
          if (!dbUser) {
            const newUser = {
              email: user.email,
              name: user.name,
              isAdmin: false,
              cart:[],
              wishlist:[],
              addresses:[],
              // image: user.image,
              // googleId: account.providerAccountId,
              // createdAt: new Date(),
            };

            const result = await User.insertOne(newUser);
            dbUser = { ...newUser, _id: result.insertedId };
          }

          // Store the database user ID in the user object
          user.id = dbUser._id.toString();
          user.isAdmin = dbUser.isAdmin;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user, trigger, session }) {
      // Add user id and isAdmin to the token when user signs in
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id; // This will now be your database user ID
        token.isAdmin = user.isAdmin;
      }

      // Update isAdmin when session is updated (if needed)
      if (trigger === "update" && session?.isAdmin !== undefined) {
        token.isAdmin = session.isAdmin;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, including the actual database user id
      if (session.user && token.id) {
        session.user.id = token.id as string; // Your database user ID
      }

      // Add isAdmin to session
      if (token.isAdmin !== undefined) {
        session.user.isAdmin = token.isAdmin as boolean;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
