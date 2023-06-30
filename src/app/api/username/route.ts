import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { UsernameValidator } from '@/lib/validators/username';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name } = UsernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });
    if (username) {
      return new Response('Username already exists', { status: 409 });
    }
    // update username in db
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });
    return new Response('Username updated', { status: 200 });
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    }

    return new Response(
      'Could not update username at this time. Please try later',
      { status: 500 }
    );
  }
}
