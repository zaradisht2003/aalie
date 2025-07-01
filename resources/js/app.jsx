
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import SalesTable from './components/SalesTable';
import ThreeDVisualization from './components/ThreeDVisualization';
import Notification from './components/Notification';
import { getSalesData, addSalesRecord, updateSalesRecord, deleteSalesRecord } from './services/api';
import '../css/app.css';


function App() {
  const [salesData, setSalesData] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeChart, setActiveChart] = useState('quarterly-comparison');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setNotification({ show: true, message: 'Loading sales data...', type: 'info' });
      const data = await getSalesData();
      setSalesData(data);
      setNotification({ show: false, message: '', type: '' });
    } catch (error) {
      setNotification({ show: true, message: 'Failed to fetch sales data', type: 'error' });
      console.error('Error fetching sales data:', error);
    }
  };

  const handleAddRecord = async (newRecord) => {
    try {
      const createdRecord = await addSalesRecord(newRecord);
      setSalesData([...salesData, createdRecord]);
      setNotification({ show: true, message: 'Record added successfully!', type: 'success' });
      return true;
    } catch (error) {
      setNotification({ show: true, message: 'Failed to add record', type: 'error' });
      console.error('Error adding record:', error);
      return false;
    }
  };

  const handleUpdateRecord = async (id, updatedRecord) => {
    try {
      await updateSalesRecord(id, updatedRecord);
      setSalesData(salesData.map(record => record.id === id ? {...record, ...updatedRecord} : record));
      setNotification({ show: true, message: 'Record updated successfully!', type: 'success' });
      return true;
    } catch (error) {
      setNotification({ show: true, message: 'Failed to update record', type: 'error' });
      console.error('Error updating record:', error);
      return false;
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteSalesRecord(id);
      setSalesData(salesData.filter(record => record.id !== id));
      setNotification({ show: true, message: 'Record deleted successfully!', type: 'success' });
    } catch (error) {
      setNotification({ show: true, message: 'Failed to delete record', type: 'error' });
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Sales Data Dashboard</h1>
          <p className="text-indigo-200">Manage and visualize your sales performance</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Notification 
          show={notification.show} 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ show: false, message: '', type: '' })} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Sales Data Management</h2>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                onClick={() => document.getElementById('add-record-modal').showModal()}
              >
                Add New Record
              </button>
            </div>
            <SalesTable 
              data={salesData} 
              onUpdate={handleUpdateRecord} 
              onDelete={handleDeleteRecord} 
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">3D Sales Visualization</h2>
              <div className="flex space-x-2">
                
              <button 
  className={`px-3 py-1 rounded-md ${activeChart === 'quarterly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
  onClick={() => setActiveChart('quarterly')}
>
  Quarterly
</button>
<button 
  className={`px-3 py-1 rounded-md ${activeChart === 'performance' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
  onClick={() => setActiveChart('performance')}
>
  Performance
</button>
<button 
  className={`px-3 py-1 rounded-md ${activeChart === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
  onClick={() => setActiveChart('products')}
>
  Products
</button>
              </div>
            </div>
            <div className="h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
              <ThreeDVisualization 
                data={salesData} 
                chartType={activeChart} 
              />
            </div>
            <div className="mt-4 text-gray-600 text-sm">
              <p>Use your mouse to interact with the visualization:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Click and drag to rotate</li>
                <li>Scroll to zoom in/out</li>
                <li>Hold shift + drag to pan</li>
                <li>Hover over bars for details</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Add Record Modal */}
      <dialog id="add-record-modal" className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <form method="dialog" className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Add New Sales Record</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              type="text" 
              id="product_name" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
          {['Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales'].map((label, index) => {
  const ids = ['q1_sales', 'q2_sales', 'q3_sales', 'q4_sales'];
  return (
    <div key={index}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type="number" 
        id={ids[index]} 
        min="0"
        step="0.01"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="0"
        required
      />
    </div>
  );
})}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <input 
              type="number" 
              id="target"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('add-record-modal').close();
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              onClick={async (e) => {
                e.preventDefault();
                const productName = document.getElementById('product_name').value;
                const q1 = document.getElementById('q1_sales').value;
                const q2 = document.getElementById('q2_sales').value;
                const q3 = document.getElementById('q3_sales').value;
                const q4 = document.getElementById('q4_sales').value;
                const target = document.getElementById('target').value;
                
                const newRecord = {
                  product_name: productName,
                  q1_sales: parseFloat(q1),
                  q2_sales: parseFloat(q2),
                  q3_sales: parseFloat(q3),
                  q4_sales: parseFloat(q4),
                  target: parseFloat(target)
                };
                
                const success = await handleAddRecord(newRecord);
                if (success) {
                  document.getElementById('add-record-modal').close();
                }
              }}
            >
              Add Record
            </button>
          </div>
        </form>
      </dialog>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Sales Data Dashboard © {new Date().getFullYear()} | Built with React and Three.js</p>
        </div>
      </footer>
    </div>
  );
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
export default App;