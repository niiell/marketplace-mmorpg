export default function Features() {
  const features = [
    {
      title: 'Aman & Terpercaya',
      desc: 'Sistem escrow dan verifikasi admin memastikan transaksi aman untuk pembeli & penjual.'
    },
    {
      title: 'Transaksi Escrow',
      desc: 'Dana ditahan hingga barang/jasa diterima. Proteksi penuh untuk kedua belah pihak.'
    },
    {
      title: 'Chat Real-Time',
      desc: 'Negosiasi & komunikasi langsung antara pembeli dan penjual dengan notifikasi instan.'
    }
  ];
  return (
    <section className="py-16 bg-[#232046] text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Keunggulan Marketplace</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-[#29235c] rounded-xl p-8 shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-base opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
