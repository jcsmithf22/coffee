import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ChatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-4 bg-secondary p-1.5 gap-0 rounded-2xl">
      <CardHeader className="px-2.5 pt-1">
        <CardTitle className="text-xs tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-background text-sm rounded-lg p-4 border shadow-lg overflow-hidden">
        <div className="whitespace-pre-wrap">{children}</div>
      </CardContent>
    </Card>
  )
}

