import StockSnapshotCard from '@/components/StockSnapshotCard';

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const res = await fetch(`http://localhost:3000/api/intraday?symbol=${params.symbol}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div className="text-red-500">Failed to load data</div>;
  }

  const { data, symbol } = await res.json();

  return (
    <div className="p-4">
      <StockSnapshotCard
        symbol={symbol}
        companyName={data.info.companyName}
        priceInfo={data.priceInfo}
      />
    </div>
  );
}
