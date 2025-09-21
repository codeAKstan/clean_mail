"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Chrome, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (provider: string) => {
    if (provider !== "gmail") {
      // For now, only Gmail is implemented
      return
    }

    setIsLoading(provider)
    
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      })

      if (result?.ok) {
        // Check if we have a valid session
        const session = await getSession()
        if (session) {
          router.push("/dashboard")
        }
      } else {
        console.error("Login failed:", result?.error)
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Clean Webmail</h1>
            <p className="text-muted-foreground">A modern, minimal email client with powerful bulk deletion</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">Connect with your existing email provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gmail Login */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-left justify-start gap-3 hover:bg-secondary bg-transparent"
              onClick={() => handleLogin("gmail")}
              disabled={isLoading !== null}
            >
              <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                <Mail className="w-3 h-3 text-white" />
              </div>
              {isLoading === "gmail" ? "Connecting..." : "Continue with Gmail"}
            </Button>

            {/* Outlook Login */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-left justify-start gap-3 hover:bg-secondary bg-transparent opacity-50 cursor-not-allowed"
              disabled={true}
            >
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <Mail className="w-3 h-3 text-white" />
              </div>
              Continue with Outlook (Coming Soon)
            </Button>

            {/* Yahoo Login */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-left justify-start gap-3 hover:bg-secondary bg-transparent opacity-50 cursor-not-allowed"
              disabled={true}
            >
              <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
                <Mail className="w-3 h-3 text-white" />
              </div>
              Continue with Yahoo (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Why choose Clean Webmail?</p>
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Bulk Delete</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Chrome className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Clean UI</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Fast & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
