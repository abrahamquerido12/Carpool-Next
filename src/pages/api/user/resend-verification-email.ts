// protected route
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { sendEmail } from '../../../lib/email';
import prisma from '../../../lib/prisma';
import { options } from '../auth/[...nextauth]';
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  // only allow post
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = session.user;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        verificationToken: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (user.isEmailVerified) {
      res.status(401).json({ error: 'User already verified' });
      return;
    }

    const oldToken = user.verificationToken;
    const today = new Date();
    const expiresIn = new Date(today.getTime() + 60 * 60 * 1000);
    const createdToken = Math.floor(100000 + Math.random() * 900000).toString();

    if (oldToken) {
      await prisma.verificationToken.delete({
        where: {
          id: +oldToken.id,
        },
      });
    }
    await prisma.verificationToken.create({
      data: {
        token: createdToken,
        userId: user.id,
        expiresAt: expiresIn,
      },
    });

    await sendEmail(user.email, createdToken);

    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: 'Something went wrong' });
  }
};
