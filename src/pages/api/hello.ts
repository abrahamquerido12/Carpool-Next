// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../lib/email';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await sendEmail('abrahamquerido@gmail.com', '1234');

  res.status(200).json({ name: 'John Doe' });
}
