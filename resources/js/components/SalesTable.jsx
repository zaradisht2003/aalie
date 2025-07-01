
import React, { useState } from 'react';

const SalesTable = ({ data, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditForm({ ...record });
  };
  
  const handleCancel = () => {
    setEditingId(null);
  };
  
  const handleSave = async (id) => {
    const success = await onUpdate(id, editForm);
    if (success) {
      setEditingId(null);
    }
  };
  
  const handleChange = (e, field) => {
    setEditForm({
      ...editForm,
      [field]: e.target.value
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sales data available. Add your first record!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q1 Sales</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q2 Sales</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q3 Sales</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q4 Sales</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === record.id ? (
                  <input
                    type="text"
                    value={editForm.product_name}
                    onChange={(e) => handleChange(e, 'product_name')}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{record.product_name}</div>
                )}
              </td>
              {['q1_sales', 'q2_sales', 'q3_sales', 'q4_sales', 'target'].map((field) => (
                <td key={field} className="px-6 py-4 whitespace-nowrap">
                  {editingId === record.id ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm[field]}
                      onChange={(e) => handleChange(e, field)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{record[field]}</div>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingId === record.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSave(record.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;