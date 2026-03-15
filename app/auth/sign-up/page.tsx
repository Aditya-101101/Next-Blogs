"use client"

import { signUpSchema } from "@/app/schemas/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"


export default function SignUpPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof signUpSchema>) {

        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed up successfully")
                        router.push('/')
                    },
                    onError: (error) => {
                        toast.error(error.error.message)
                    }
                }
            })
        })

    }

    return (

        <Card >
            <CardHeader >
                <CardTitle >
                    Sign up
                </CardTitle>

                <CardDescription >
                    Create an account to get started
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        Full Name
                                    </FieldLabel>
                                    <Input
                                        placeholder="John Doe"
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
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field >
                                    <FieldLabel >
                                        Email
                                    </FieldLabel>
                                    <Input
                                        placeholder="john@doe.com"
                                        type="email"
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
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field >

                                    <FieldLabel >
                                        password
                                    </FieldLabel>

                                    <Input
                                        placeholder="*******"
                                        type="password"
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
                        ) : <span>Signup</span>}</Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}