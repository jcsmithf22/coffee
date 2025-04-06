import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ChatCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) {
  return (
    <Card className="mb-4 bg-secondary p-1.5 gap-0 rounded-2xl">
      <CardHeader className="px-2.5 pt-1">
        <CardTitle className="text-xs tracking-tight flex items-center gap-2">
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-background text-sm rounded-lg p-4 border shadow-lg overflow-hidden">
        <div className="whitespace-pre-wrap">{children}</div>
      </CardContent>
    </Card>
  )
}

