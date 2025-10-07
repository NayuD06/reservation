import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';

// Định nghĩa kiểu dữ liệu cho reservation
interface Reservation {
  id?: number;
  customer_name?: string;
  phone?: string;
  party_size?: number;
  reserved_at?: string;
  status?: 'pending' | 'confirmed' | 'seated' | 'canceled';
}

// Định nghĩa kiểu dữ liệu cho form
interface FormData {
  customer_name: string;
  phone: string;
  party_size: number;
  reserved_at: string;
  status: 'pending' | 'confirmed' | 'seated' | 'canceled';
}

const Form: React.FC<{ reservation?: Reservation }> = ({ reservation = {} }) => {
  const [form, setForm] = useState<FormData>({
    customer_name: reservation.customer_name || '',
    phone: reservation.phone || '',
    party_size: reservation.party_size || 1,
    reserved_at: reservation.reserved_at || '',
    status: reservation.status || 'pending',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload: Record<string, any> = { ...form };
    
    if (reservation.id) {
      router.put(`/reservations/${reservation.id}`, payload, {
        onFinish: () => setLoading(false)
      });
    } else {
      router.post('/reservations', payload, {
        onFinish: () => setLoading(false)
      });
    }
  };

  const isEdit = !!reservation.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEdit ? 'Chỉnh sửa đặt bàn' : 'Tạo đặt bàn mới'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Cập nhật thông tin đặt bàn' : 'Điền thông tin để tạo đặt bàn mới'}
              </p>
            </div>
            <Link 
              href="/reservations" 
              className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              ← Quay lại
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Nhập tên khách hàng"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng người <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.party_size}
                onChange={(e) => setForm({ ...form, party_size: parseInt(e.target.value) || 1 })}
                placeholder="Số người"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Tối đa 20 người</p>
            </div>

            {/* Reserved At */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian đặt bàn <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.reserved_at}
                onChange={(e) => setForm({ ...form, reserved_at: e.target.value })}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'pending' | 'confirmed' | 'seated' | 'canceled' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="seated">Đã vào bàn</option>
                <option value="canceled">Đã hủy</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link 
                href="/reservations"
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Hủy
              </Link>
              <button 
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white rounded-md transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    💾 {isEdit ? 'Cập nhật' : 'Tạo mới'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="text-blue-400 mr-3">💡</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Ghi chú:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Tất cả các trường có dấu (*) là bắt buộc</li>
                <li>Thời gian đặt bàn phải từ hiện tại trở đi</li>
                <li>Số lượng người tối đa là 20</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;