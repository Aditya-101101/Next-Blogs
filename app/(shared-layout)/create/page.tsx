"use client"

import { createBlogAction } from "@/app/actions";
import { blogSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod'

export default function CreateRoute() {
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            content: "",
            image: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof blogSchema>) {
        startTransition(async () => {
            await createBlogAction(values);
        })
    }

    return (
        <div className="py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="text-xl text-muted-foreground pt-4">Share your thoughts with the world</p>
            </div>
            <Card className="w-full max-w-xl mx-auto" >
                <CardHeader>
                    <CardTitle>Create Blog Article</CardTitle>
                    <CardDescription>Create a new blog article</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Title
                                        </FieldLabel>
                                        <Input
                                            placeholder="My Gaming Journey..."
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Content
                                        </FieldLabel>
                                        <Textarea  {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="image"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Image
                                        </FieldLabel>
                                        <Input
                                            placeholder="upload cover image"
                                            type="file"
                                            accept="image/*"
                                            aria-invalid={fieldState.invalid}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                field.onChange(file)
                                            }}
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
                            ) : <span>Create Post</span>}</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}