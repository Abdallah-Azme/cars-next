export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold">{title}</h4>
    </div>
  );
}
