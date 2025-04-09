import NextAuth from 'next-auth';
import { authOptions } from "../[...nextauth]/route";

export async function POST(req) {
  const { email, password } = await req.json();
  const authResponse = await NextAuth(authOptions).auth.signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (authResponse.error) {
    return new Response(JSON.stringify({ error: authResponse.error }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ token: authResponse.token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}