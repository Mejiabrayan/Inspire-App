import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, subredditId } = PostValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }
    // verify use is subscribed to subreddit
    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return new Response('Unauthorized', { status: 403 });
    }
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('invalid request data passed', {
        status: 422,
      });
    }
    return new Response(
      'Could not post to subreddit at this time. Please try again later.',
      {
        status: 500,
      }
    );
  }
}
