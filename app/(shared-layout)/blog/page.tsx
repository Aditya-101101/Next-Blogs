
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export default function BlogPage() {
    return (
        <div className="py-12">
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blog</h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughts, and trends from our team. </p>
            </div>
            <Suspense fallback={<SkeletonLoadingUi />}>
                <LoadBlogs />
            </Suspense>

        </div>
    )
}

async function LoadBlogs() {
    const data = await fetchQuery(api.posts.getPosts);
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((post) => (
                <Card key={post._id} className="pt-0">
                    <div className=" relative h-48 w-full overflow-hidden">
                        <Image src="/fantasy-style-galaxy-background.jpg" alt="cover" fill className="rounded-t-lg"></Image>
                    </div>
                    <CardContent>
                        <Link href={`/blog/${post._id}`}>
                            <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{post?.content}</p>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/blog/${post._id}`} className={buttonVariants({
                            className: 'w-full'
                        })} >Read More</Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function SkeletonLoadingUi() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {[
                ...Array(3)].map((_, i) => (
                    <div className="flex flex-col space-y-3" key={i}>
                        <Skeleton className="h-48 flex flex-col" />
                        <div className="space-y-2 flex flex-col">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
        </div>
    )
}