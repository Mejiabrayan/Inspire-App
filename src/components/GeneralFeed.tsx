import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import PostFeed from "./PostFeed"
import { db } from "@/lib/db"

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: 'desc',
        
        },
        include: {
            author: true,
            comments: true,
            subreddit: true,
            votes: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    })
  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed