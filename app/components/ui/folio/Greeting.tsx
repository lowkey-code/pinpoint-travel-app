import { SunHorizon, Sun, MoonStars, Cloud } from "@phosphor-icons/react"

function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return {
      text: "Bom dia, viajante",
      icon: <SunHorizon weight="fill" className="w-6 h-6 text-stamp-amber" />,
    }
  }
  if (hour >= 12 && hour < 18) {
    return {
      text: "Boa tarde, viajante",
      icon: <Sun weight="fill" className="w-6 h-6 text-stamp-amber" />,
    }
  }
  if (hour >= 18 && hour < 22) {
    return {
      text: "Boa noite, viajante",
      icon: <MoonStars weight="fill" className="w-6 h-6 text-stamp-navy" />,
    }
  }
  return {
    text: "Boas viagens",
    icon: <Cloud weight="fill" className="w-6 h-6 text-ink-utility" />,
  }
}

interface GreetingProps {
  className?: string
}

export function Greeting({ className }: GreetingProps) {
  const { text, icon } = getGreeting()

  return (
    <div className={className}>
      <p className="font-sans font-bold text-2xl text-ink-primary flex items-center gap-2">
        {text}
        {icon}
      </p>
    </div>
  )
}
