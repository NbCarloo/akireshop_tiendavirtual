import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/admin/customers', { params: { page, limit: 25 } })
      .then(r => { setCustomers(r.data.customers); setTotal(r.data.total); });
  }, [page]);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Clientes</h1>
      <p className="text-sm text-gray-500 mb-4">{total} clientes registrados</p>

      <div className="bg-white border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Registro</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Newsletter</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString('es-CR')}</td>
                <td className="px-4 py-3">
                  {c.newsletterSubscribed
                    ? <span className="badge bg-green-100 text-green-700 px-2 py-0.5 text-xs">Sí</span>
                    : <span className="badge bg-gray-100 text-gray-500 px-2 py-0.5 text-xs">No</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 25 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / 25) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 text-sm border transition-colors ${page === p ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
            >{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
