export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fef2f2' }}>
        <h2 style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '2rem', marginBottom: '1rem' }}>Terjadi Error</h2>
        <p style={{ color: '#dc2626', marginBottom: '0.5rem' }}>{error?.message || "Unknown error"}</p>
        <pre style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.25rem', maxWidth: 600, overflowX: 'auto' }}>
          {error?.stack || "No stacktrace"}
        </pre>
        <form>
          <button type="submit" onClick={() => reset()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', borderRadius: '0.25rem' }}>Coba Lagi</button>
        </form>
      </body>
    </html>
  );
}
