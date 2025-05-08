import { useEffect, useState } from 'react';

interface Dispute {
  id: number;
  transaction_id: number;
  user_id: number;
  reason: string;
  evidence_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DisputeResponse {
  disputes: Dispute[];
}

const DISPUTE_STATUSES = {
  RESOLVED: 'resolved',
  REFUNDED: 'refunded',
};

const DisputesPage = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDisputes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/disputes');
      if (!res.ok) {
        throw new Error('Failed to fetch disputes');
      }
      const data: DisputeResponse = await res.json();
      setDisputes(data.disputes);
    } catch (error) {
      setError('Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/disputes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
      fetchDisputes();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dispute Management</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p>Loading disputes...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Transaction ID</th>
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Reason</th>
              <th className="border border-gray-300 p-2">Evidence</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id}>
                <td className="border border-gray-300 p-2">{dispute.id}</td>
                <td className="border border-gray-300 p-2">{dispute.transaction_id}</td>
                <td className="border border-gray-300 p-2">{dispute.user_id}</td>
                <td className="border border-gray-300 p-2">{dispute.reason}</td>
                <td className="border border-gray-300 p-2">
                  {dispute.evidence_url ? (
                    <a href={dispute.evidence_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      View Evidence
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="border border-gray-300 p-2">{dispute.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(dispute.id, DISPUTE_STATUSES.RESOLVED)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => updateStatus(dispute.id, DISPUTE_STATUSES.REFUNDED)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisputesPage;