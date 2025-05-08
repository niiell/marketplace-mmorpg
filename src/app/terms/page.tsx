export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Syarat & Ketentuan</h1>
      <p className="mb-4">
        Dengan menggunakan platform ini, Anda setuju untuk mematuhi semua aturan dan kebijakan yang berlaku. 
        Transaksi dilakukan secara aman melalui sistem escrow. 
        Pelanggaran terhadap aturan dapat mengakibatkan penangguhan akun.
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          Pengguna wajib memberikan data yang benar dan tidak menipu.
        </li>
        <li>
          Penjual dan pembeli wajib menyelesaikan transaksi sesuai kesepakatan.
        </li>
        <li>
          Admin berhak membatalkan transaksi atau menangguhkan akun jika ditemukan pelanggaran.
        </li>
        <li>
          Refund hanya diproses sesuai kebijakan dan hasil investigasi admin.
        </li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">
        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}