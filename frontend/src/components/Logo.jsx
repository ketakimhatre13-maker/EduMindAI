export default function Logo({ size = 'md' }) {
  return (
    <div className={`logo-mark logo-${size}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="11" fill="url(#logoGrad)" />
        <path d="M11 27V13l9 7.5 9-7.5v14h-3.5V17.5L20 21l-4.5-3.5V27H11z" fill="white" />
        <circle cx="29" cy="11" r="5" fill="#fbbf24" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
