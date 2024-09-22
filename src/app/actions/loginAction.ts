'use server';

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function loginAction(password: string) {
  if (password === process.env.MASTER_PASSWORD) {
    // Create a JWT
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set the JWT as a cookie
    const cookieStore = cookies();

    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      sameSite: 'lax',
    });

    return { success: true };
  } else {
    return { success: false };
  }
}
