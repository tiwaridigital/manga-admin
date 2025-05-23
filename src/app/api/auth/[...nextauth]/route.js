import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  ...
});

export { handler as GET, handler as POST };
