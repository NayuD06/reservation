import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

// Định nghĩa kiểu dữ liệu cho một reservation
interface Reservation {
  id: number;
  customer_name: string;
  phone: string;
  party_size: number;
  reserved_at: string;
  status: 'pending' | 'confirmed' | 'seated' | 'canceled';
}

// Định nghĩa kiểu dữ liệu cho props từ usePage
interface PageProps {
  reservations: {
    data: Reservation[];
    current_page: number;
    last_page: number;
    // Thêm các thuộc tính khác của paginate nếu cần
  };
  flash?: { success?: string; error?: string };
  [key: string]: any; // Index signature để thỏa mãn constraint
}

const Index: React.FC = () => {
  const { reservations, flash } = usePage<PageProps>().props;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const handleFilter = () => {
    router.get('/reservations', { search, status });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đặt bàn</h1>
          <p className="text-gray-600">Quản lý thông tin đặt bàn và theo dõi trạng thái</p>
        </div>

        {/* Flash Messages */}
        {flash?.success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {flash.error}
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="seated">Đã vào bàn</option>
                <option value="canceled">Đã hủy</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <span className="flex items-center gap-2">
                  🔍 Lọc
                </span>
              </button>
              <Link 
                href="/reservations/create"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <span className="flex items-center gap-2">
                  ➕ Thêm mới
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số người
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.data.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{res.customer_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{res.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{res.party_size} người</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(res.reserved_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        res.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        res.status === 'seated' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {res.status === 'confirmed' ? 'Đã xác nhận' :
                         res.status === 'pending' ? 'Chờ xác nhận' :
                         res.status === 'seated' ? 'Đã vào bàn' :
                         'Đã hủy'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link 
                        href={`/reservations/${res.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                      >
                        ✏️ Sửa
                      </Link>
                      <button 
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn xóa đặt bàn này không?')) {
                            router.delete(`/reservations/${res.id}`);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {reservations.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-4">📅</div>
                        <div className="text-lg font-medium mb-2">Chưa có đặt bàn nào</div>
                        <div className="text-sm">Hãy tạo đặt bàn mới để bắt đầu</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {reservations.data.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Trang <span className="font-medium">{reservations.current_page}</span> / 
                <span className="font-medium">{reservations.last_page}</span>
              </div>
              <div className="flex space-x-2">
                {/* Có thể thêm các nút Previous/Next ở đây nếu cần */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;