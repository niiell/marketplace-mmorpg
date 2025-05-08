export default function Testimonials() {
  const testimonials = [
    {
      name: 'Andi, Jakarta',
      text: 'Transaksi cepat, aman, dan supportnya responsif. Marketplace terbaik untuk jual beli gold Ragnarok!',
      avatar: '/images/andi.jpg',
    },
    {
      name: 'Maya, Surabaya',
      text: 'Suka banget fitur chat real-time-nya. Penjual ramah dan prosesnya jelas.',
      avatar: '/images/maya.jpg',
    },
    {
      name: 'Kevin, Bangkok',
      text: 'Escrow system-nya bikin tenang. Nggak takut kena scam lagi!',
      avatar: '/images/kevin.jpg',
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#232046] to-[#1a1833] text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Testimoni Pengguna</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#29235c] rounded-xl p-6 shadow-lg flex flex-col items-center">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mb-4" />
              <p className="mb-4 italic">"{t.text}"</p>
              <span className="font-semibold text-indigo-300">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}