"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignInMutation } from "../api/authApi"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  })
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const [signIn, { isLoading }] = useSignInMutation()

  const handleLogin = async (payload: z.infer<typeof formSchema>) => {
    try {
      const res = await signIn(payload)

      if (res.error) {
        toast.error((res.error as { message: string }).message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="md:hidden animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-red-500/5 blur-2xl animate-pulse" />
                      <Image
                        width={180}
                        height={180}
                        src="/logo-nobg.png"
                        alt="EyeSOS Logo"
                        className="relative h-44 w-44 object-contain -mb-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Welcome back</h1>
                    <p className="text-[13px] text-muted-foreground text-balance italic font-medium opacity-80">
                      Login to your EyeSOS account
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-2 hover:text-primary">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={400}
              height={400}
              src="/logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <p className="px-6 text-center text-[10px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto opacity-70">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-2 hover:text-red-600 transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2 hover:text-red-600 transition-colors">
          Privacy Policy
        </a>.
      </p>
    </div>
  )
}