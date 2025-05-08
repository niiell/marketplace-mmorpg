export default function PrivacyPolicyPage() {
  const lastUpdated = '28 April 2025';
  const policyPoints = [
    'Data Anda hanya digunakan untuk keperluan transaksi dan keamanan platform.',
    'Anda dapat meminta penghapusan data kapan saja melalui menu profil.',
    'Kami mematuhi regulasi perlindungan data di Asia Tenggara.',
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
      <p className="mb-4">
        Kami menghargai privasi Anda. Semua data pengguna disimpan dengan aman dan tidak dibagikan ke pihak ketiga tanpa izin. Untuk detail lengkap, silakan hubungi support kami.
      </p>
      <ul className="list-disc ml-6 space-y-2">
        {policyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-gray-500">Terakhir diperbarui: {lastUpdated}</p>
    </div>
  );
}