import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = CommentValidator.parse(body);
    const session = await getAuthSession();

    if (!session) return new Response('Unauthorized', { status: 401 });
    await db.comment.create({
      data: {
        postId,
        text,
        authorId: session.user.id,
        replyToId,
      },
    });
    return new Response('OK');
  } catch (error) {
    if (error) {
      return new Response('Invalid request data passed', { status: 422 });
    }

    return new Response(
      'Could not comment at this time. Please try again later.',
      { status: 422 }
    );
  }
}
