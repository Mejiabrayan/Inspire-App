import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import { Button, buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC } from 'react';

const layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;
  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className='sm:container max-7xl mx-auto h-full pt-12'>
      <div>
        {/* TODO: Button to take us back */}
        <div className='grid grid-cols-3 md-grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
          <div className='flex flex-col col-span-2 space-y-6'>{children}</div>
          {/* info sidebar */}
          <div className='hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='px-6 py-4'>
              <p className='font-semi py-3'>About r/{subreddit.name}</p>
            </div>

            <dl className='divide-y divide-gray-200 px-6 py-4 text-sm leading-6 bg-white '>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-gray-500'>Created</dt>
                <dd className='text-gray-700'>
                  <time dateTime={subreddit.createdAt.toLocaleDateString()}>
                    {format(subreddit.createdAt, 'MMMM dd, yyyy')}
                  </time>
                </dd>
              </div>
              <div className='flex justify-between gap-4 p-y-3'>
                <dt className='text-gray-500'>Members</dt>
                <dd className='text-gray-700'>
                  <div className='text-gray-900'>{memberCount} members</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user.id ? (
                <div className='flex justify-between gap-x-4 py-3'>
                  <p className='text-gray-500'>
                    You are a moderator of this subreddit.
                  </p>
                </div>
              ) : null}
              {subreddit.creatorId !== session?.user.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full',
                })}
                href={`r/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
