interface KpiGridProps {
  items: Array<{
    label: string;
    value: string;
  }>;
}

export default function KpiGrid({ items }: KpiGridProps) {
  return (
    <section className="kpiGrid">
      {items.map((item) => (
        <article className="kpiCard" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
