import Card from "@/components/ui/Card";

export default function AdminLoading() {
  return <div className="animate-pulse space-y-5 motion-reduce:animate-none" role="status" aria-label="Loading admin page">
    <Card className="h-24 bg-surface-alt" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <Card key={item} className="h-28 bg-surface-alt" />)}</div>
    <div className="grid gap-5 xl:grid-cols-2"><Card className="h-80 bg-surface-alt" /><Card className="h-80 bg-surface-alt" /></div>
  </div>;
}
