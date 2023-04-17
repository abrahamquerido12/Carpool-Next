import { compare } from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import prisma from './prisma';

export type Credentials = {
  email: string;
  password: string;
};

export async function login(credentials: any) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new Error('No user found');
    }
    const passwordValid = await compare(credentials.password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: '7d',
      }
    );
    return {
      token,
      user,
    };
  } catch (error) {
    console.log(error);
  }
}
