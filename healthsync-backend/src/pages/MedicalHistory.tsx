import React, { useState, useRef } from 'react';
import { FileTextIcon, PlusIcon, DownloadIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
const initialConditions = [
{
  name: 'Type 2 Diabetes',
  status: 'active',
  color: 'bg-red-500',
  diagnosedDate: 'Jan 2020'
},
{
  name: 'Hypertension',
  status: 'active',
  color: 'bg-orange-500',
  diagnosedDate: 'Mar 2019'
},
{
  name: 'Asthma',
  status: 'managed',
  color: 'bg-emerald-500',
  diagnosedDate: 'Jun 2015'
}];

const initialReports = [
{
  name: 'Blood Test Results',
  date: 'Dec 15, 2023',
  type: 'Lab Report',
  image:
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop'
},
{
  name: 'MRI Scan',
  date: 'Nov 28, 2023',
  type: 'Imaging',
  image:
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=100&h=100&fit=crop'
},
{
  name: 'ECG Report',
  date: 'Oct 10, 2023',
  type: 'Cardiac',
  image:
  'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=100&h=100&fit=crop'
}];

export function MedicalHistory() {
  const [conditions, setConditions] = useState(initialConditions);
  const [reports, setReports] = useState(initialReports);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondition, setNewCondition] = useState({
    name: '',
    status: 'active',
    diagnosedDate: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newReport = {
        name: file.name,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        type: 'Uploaded Document',
        image:
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop' // Generic document image
      };
      setReports([newReport, ...reports]);
      toast.success('Report uploaded successfully!');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondition.name || !newCondition.diagnosedDate) {
      toast.error('Please fill in all fields');
      return;
    }
    setConditions([
    {
      ...newCondition,
      color:
      newCondition.status === 'active' ? 'bg-red-500' : 'bg-emerald-500'
    },
    ...conditions]
    );
    setNewCondition({
      name: '',
      status: 'active',
      diagnosedDate: ''
    });
    setShowAddCondition(false);
    toast.success('Condition added successfully!');
  };
  const handleDownload = (reportName: string) => {
    toast.info(`Downloading ${reportName}...`);
  };
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medical History
        </h1>
        <p className="text-gray-600">
          View and manage your health conditions and medical reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Conditions</h2>
            <button
              onClick={() => setShowAddCondition(!showAddCondition)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              
              {showAddCondition ?
              <XIcon className="w-4 h-4" /> :

              <PlusIcon className="w-4 h-4" />
              }
              <span className="text-sm font-medium">
                {showAddCondition ? 'Cancel' : 'Add Condition'}
              </span>
            </button>
          </div>

          {showAddCondition &&
          <form
            onSubmit={handleAddCondition}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            
              <div className="space-y-3">
                <input
                type="text"
                placeholder="Condition Name"
                value={newCondition.name}
                onChange={(e) =>
                setNewCondition({
                  ...newCondition,
                  name: e.target.value
                })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
              
                <div className="flex gap-3">
                  <input
                  type="text"
                  placeholder="Diagnosed Date (e.g. Jan 2024)"
                  value={newCondition.diagnosedDate}
                  onChange={(e) =>
                  setNewCondition({
                    ...newCondition,
                    diagnosedDate: e.target.value
                  })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                
                  <select
                  value={newCondition.status}
                  onChange={(e) =>
                  setNewCondition({
                    ...newCondition,
                    status: e.target.value
                  })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500">
                  
                    <option value="active">Active</option>
                    <option value="managed">Managed</option>
                  </select>
                </div>
                <button
                type="submit"
                className="w-full py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600">
                
                  Save Condition
                </button>
              </div>
            </form>
          }

          <div className="space-y-3">
            {conditions.map((condition, index) =>
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              
                <div className="flex items-center gap-3">
                  <div
                  className={`w-3 h-3 ${condition.color} rounded-full`}>
                </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {condition.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Diagnosed: {condition.diagnosedDate}
                    </p>
                  </div>
                </div>
                <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${condition.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                
                  {condition.status === 'active' ? 'Active' : 'Managed'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Keep your medical conditions updated for
              accurate health insights and recommendations.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reports</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png" />
            
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Report</span>
            </button>
          </div>

          <div className="space-y-3">
            {reports.map((report, index) =>
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              
                <div className="flex items-center gap-3">
                  <img
                  src={report.image}
                  alt={report.name}
                  className="w-12 h-12 rounded-lg object-cover" />
                
                  <div>
                    <p className="font-semibold text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-600">
                      {report.type} • {report.date}
                    </p>
                  </div>
                </div>
                <button
                onClick={() => handleDownload(report.name)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                
                  <DownloadIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Medical Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            <div className="relative flex gap-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center z-10">
                <FileTextIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pb-6">
                <p className="font-semibold text-gray-900">
                  Blood Test Completed
                </p>
                <p className="text-sm text-gray-600 mb-2">December 15, 2023</p>
                <p className="text-sm text-gray-500">
                  All vitals within normal range. Glucose levels stable.
                </p>
              </div>
            </div>
            <div className="relative flex gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <FileTextIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pb-6">
                <p className="font-semibold text-gray-900">
                  MRI Scan Performed
                </p>
                <p className="text-sm text-gray-600 mb-2">November 28, 2023</p>
                <p className="text-sm text-gray-500">
                  Routine checkup. No abnormalities detected.
                </p>
              </div>
            </div>
            <div className="relative flex gap-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center z-10">
                <FileTextIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  ECG Report Generated
                </p>
                <p className="text-sm text-gray-600 mb-2">October 10, 2023</p>
                <p className="text-sm text-gray-500">
                  Heart rhythm normal. Continue current medication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}