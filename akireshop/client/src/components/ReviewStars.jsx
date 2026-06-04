export default function ReviewStars({ rating, size = 'sm' }) {
  const s = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <span className={s}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </span>
  );
}
