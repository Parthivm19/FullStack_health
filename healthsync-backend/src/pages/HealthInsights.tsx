import React, { useState } from 'react';
import {
  BrainIcon,
  PillIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon } from
'lucide-react';
import { toast } from 'sonner';
const initialMedications = [
{
  name: 'Metformin',
  dosage: '500mg',
  time: '8:00 AM',
  status: 'taken'
},
{
  name: 'Lisinopril',
  dosage: '10mg',
  time: '8:00 AM',
  status: 'taken'
},
{
  name: 'Aspirin',
  dosage: '81mg',
  time: '12:00 PM',
  status: 'pending'
},
{
  name: 'Vitamin D',
  dosage: '1000 IU',
  time: '8:00 PM',
  status: 'pending'
}];

export function HealthInsights() {
  const [symptom, setSymptom] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [medications, setMedications] = useState(initialMedications);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    time: ''
  });
  const handleGetInsights = () => {
    if (!symptom.trim()) {
      toast.error('Please describe your symptoms first');
      return;
    }
    setPrediction(
      'Based on your symptoms, you may be experiencing seasonal allergies. Consider consulting with your doctor if symptoms persist.'
    );
    toast.success('Analysis complete');
  };
  const toggleMedicationStatus = (index: number) => {
    const updatedMeds = [...medications];
    updatedMeds[index].status =
    updatedMeds[index].status === 'taken' ? 'pending' : 'taken';
    setMedications(updatedMeds);
    toast.success(
      `${updatedMeds[index].name} marked as ${updatedMeds[index].status}`
    );
  };
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dosage || !newMed.time) {
      toast.error('Please fill in all fields');
      return;
    }
    setMedications([
    ...medications,
    {
      ...newMed,
      status: 'pending'
    }]
    );
    setNewMed({
      name: '',
      dosage: '',
      time: ''
    });
    setShowAddMed(false);
    toast.success('Medication added successfully');
  };
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Health Insights
        </h1>
        <p className="text-gray-600">
          AI-powered health analysis and medication tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BrainIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Symptom & Disease Prediction
              </h2>
              <p className="text-sm text-gray-600">
                Describe your symptoms for AI analysis
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you experiencing?
              </label>
              <textarea
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                rows={4}
                placeholder="E.g., I have a headache, feeling tired, and experiencing mild fever..." />
              
            </div>

            <button
              onClick={handleGetInsights}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
              
              Get Insights
            </button>

            {prediction &&
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-900 mb-1">
                      AI Analysis
                    </p>
                    <p className="text-sm text-emerald-800">{prediction}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PillIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Medicine Tracker
              </h2>
              <p className="text-sm text-gray-600">
                Track and manage your medications
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {medications.map((med, index) =>
            <div
              key={index}
              onClick={() => toggleMedicationStatus(index)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              
                <div className="flex items-center gap-3">
                  <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${med.status === 'taken' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                  
                    {med.status === 'taken' ?
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600" /> :

                  <ClockIcon className="w-5 h-5 text-orange-600" />
                  }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600">
                      {med.dosage} • {med.time}
                    </p>
                  </div>
                </div>
                <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${med.status === 'taken' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                
                  {med.status === 'taken' ? 'Taken' : 'Pending'}
                </span>
              </div>
            )}
          </div>

          {showAddMed ?
          <form
            onSubmit={handleAddMedication}
            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm text-gray-900">
                  Add Medication
                </h4>
                <button
                type="button"
                onClick={() => setShowAddMed(false)}
                className="text-gray-500 hover:text-gray-700">
                
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                type="text"
                placeholder="Medication Name"
                value={newMed.name}
                onChange={(e) =>
                setNewMed({
                  ...newMed,
                  name: e.target.value
                })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
              
                <div className="flex gap-3">
                  <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={newMed.dosage}
                  onChange={(e) =>
                  setNewMed({
                    ...newMed,
                    dosage: e.target.value
                  })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                
                  <input
                  type="text"
                  placeholder="Time (e.g. 8:00 AM)"
                  value={newMed.time}
                  onChange={(e) =>
                  setNewMed({
                    ...newMed,
                    time: e.target.value
                  })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                
                </div>
                <button
                type="submit"
                className="w-full py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600">
                
                  Save Medication
                </button>
              </div>
            </form> :

          <button
            onClick={() => setShowAddMed(true)}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors">
            
              + Add New Medication
            </button>
          }
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Personalized Health Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              💧 Stay Hydrated
            </h4>
            <p className="text-sm text-gray-600">
              Drink at least 8 glasses of water daily to maintain optimal
              health.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              🏃 Regular Exercise
            </h4>
            <p className="text-sm text-gray-600">
              Aim for 30 minutes of moderate activity most days of the week.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              😴 Quality Sleep
            </h4>
            <p className="text-sm text-gray-600">
              Get 7-9 hours of sleep each night for better recovery and health.
            </p>
          </div>
        </div>
      </div>
    </div>);

}