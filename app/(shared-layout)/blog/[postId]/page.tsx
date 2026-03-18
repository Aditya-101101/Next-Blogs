
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/commentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PostIdRouteProps {
    params: Promise<{
        postId: Id<"posts">;
    }>
}

export async function generateMetadata({ params }: PostIdRouteProps): Promise<Metadata> {
    const { postId } = await params
    const post = await fetchQuery(api.posts.getPostById, { blogId: postId })
    if (!post) {
        return {
            title: "Post not found",
        }
    }
    return {
        title: post.title,
        description: post.content
    }
}


export default async function PostIdRoute({ params }: PostIdRouteProps) {

    const { postId } = await params;

    const token=await getToken();
    const [post, preloadedComments, userId] = await Promise.all([
        await fetchQuery(api.posts.getPostById, { blogId: postId }),
        await preloadQuery(api.comments.getCommentsByPostId, {
            postId: postId,
        }),
        await fetchQuery(api.presence.getUserId,{},{token})
    ])
    
    if(!userId)
    {
          return redirect('/auth/login')
    }

    if (!post) {
        return (
            <div>
                <h1 className="text-6xl font-extrabold text-red-500 py-20" >No Post Found</h1>
            </div>
        )
    }
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Link href={'/blog'} className={buttonVariants({ variant: "outline", className: " mb-4" })}>
                <ArrowLeft className="size-4" /> Back to Blog
            </Link>
            <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
                <Image unoptimized src={post.imageUrl ?? '/fantasy-style-galaxy-background.jpg'} alt={post.title ?? 'cover image'} fill className="object-cover hover:scale-105 transition duration-500" />
            </div>

            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Posted on: {new Date(post._creationTime).toLocaleDateString()}</p>
                    {userId && <PostPresence roomId={post._id} userId={userId} />}
                </div>
            </div>
            <Separator className="my-8" />
            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {post.content}
            </p>
            <Separator className="my-8" />
            <CommentSection preloadedComments={preloadedComments} />
        </div>
    )
}