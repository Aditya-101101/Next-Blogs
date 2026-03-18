'use client'

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation,usePreloadedQuery} from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {

    const params = useParams<{ postId: Id<"posts"> }>()
    const data = usePreloadedQuery(props.preloadedComments)
    const createComment = useMutation(api.comments.createComment)
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.postId,
        },
    })

    function onSubmit(data: z.infer<typeof commentSchema>) {
        startTransition(async () => {
            try {
                await createComment(data);
                form.reset();
                toast.success("Comment posted")
            } catch (error) {
                toast.error("Failed to upload comment")
            }
        }
        )
    }

    if (data === undefined) {
        return <p>Loading...</p>
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 border-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-bold">{data.length} Comments</h2>
            </CardHeader>
            <CardContent className="space-y-8">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="body"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Title
                                </FieldLabel>
                                <Input
                                    placeholder="share your thoughts"
                                    type="text"
                                    className="pt-4 pb-10"
                                    aria-invalid={fieldState.invalid}
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Button disabled={isPending}>{isPending ? (<>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Loading...</span>
                    </>
                    ) : <span>Comment</span>}</Button>
                </form>
                {data?.length > 0 && <Separator />}
                <section className="space-y-6">
                    {
                        data?.map((comment) => (
                            <div key={comment._id} className="flex gap-4">
                                <Avatar className="size-10 shrink-0">
                                    <AvatarImage src={`https://avatar.vercel.sh/${comment.auhtorName}`}
                                        alt={comment.auhtorName}
                                    />
                                    <AvatarFallback>
                                        {comment.auhtorName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between ">
                                        <p className="font-semibold text-xl">{comment.auhtorName}</p>
                                        <p className="text-muted-foreground text-xs">{new Date(comment._creationTime).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                        {comment.body}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </section>
            </CardContent>
        </Card>
    )
}
