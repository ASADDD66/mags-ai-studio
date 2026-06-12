import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tighter text-gradient mb-6">
            Enterprise AI Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Build, deploy, and scale AI agents with MAGS Studio
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
