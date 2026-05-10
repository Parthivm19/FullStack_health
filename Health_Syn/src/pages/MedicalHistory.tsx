import React, { useState, useRef, useEffect } from "react";
import {
  FileTextIcon,
  PlusIcon,
  DownloadIcon,
  XIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import {
  getMedicalHistory,
  addCondition,
  getReports,
  uploadReport,
  deleteReport,
} from "../api/medicalHistory";

interface ReportType {
  _id: string;
  name: string;
  date: string;
  type: string;
  image: string;
  analysis?: any;
  parameters?: any;
  summary?: string;
  extractedText?: string;
}

export function MedicalHistory() {
  const [conditions, setConditions] = useState<any[]>([]);
  const [reports, setReports] = useState<ReportType[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondition, setNewCondition] = useState({
    name: "",
    status: "active",
    diagnosedDate: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load medical history from MongoDB on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const medicalData = await getMedicalHistory();

        setConditions(medicalData.conditions || []);

        const reportsData = await getReports();

        const formattedReports = reportsData.map((report: any) => ({
          _id: report._id,

          name: report.filename,

          date: new Date(report.uploadedAt).toLocaleDateString(),

          type: "Blood Report Analysis",

          image:
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop",

          analysis: report.analysis,

          parameters: report.parameters,

          summary: report.summary,

          extractedText: report.extractedText,
        }));

        setReports(formattedReports);
      } catch (err) {
        console.log(err);

        toast.error("Failed to load medical history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const data = await uploadReport(file);

      const savedReport = data.report;

      const formattedReport = {
        _id: savedReport._id,

        name: savedReport.filename,

        date: new Date(savedReport.uploadedAt).toLocaleDateString(),

        type: "Blood Report Analysis",

        image:
          "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop",

        analysis: savedReport.analysis,

        parameters: savedReport.parameters,

        summary: savedReport.summary,

        extractedText: savedReport.extractedText,
      };

      setReports((prev) => [formattedReport, ...prev]);

      toast.success("Report analyzed successfully!");
    } catch (err) {
      console.log(err);

      toast.error("Failed to analyze report");
    } finally {
      setUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondition.name || !newCondition.diagnosedDate) {
      toast.error("Please fill in all fields");
      return;
    }
    const conditionData = {
      ...newCondition,
      color: newCondition.status === "active" ? "bg-red-500" : "bg-emerald-500",
    };
    try {
      const updated = await addCondition(conditionData);
      setConditions(updated.conditions);
      setNewCondition({ name: "", status: "active", diagnosedDate: "" });
      setShowAddCondition(false);
      toast.success("Condition added successfully!");
    } catch (err) {
      toast.error("Failed to add condition");
    }
  };

  const handleDownload = (report: ReportType) => {
    const content = `
REPORT NAME:
${report.name}

DATE:
${report.date}

SUMMARY:
${report.summary || "N/A"}

PARAMETERS:
${JSON.stringify(report.parameters, null, 2)}

ANALYSIS:
${JSON.stringify(report.analysis, null, 2)}

DISCLAIMER:
This is not a diagnosis.
`;

    const blob = new Blob([content], { type: "text/plain" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${report.name}.txt`;

    a.click();

    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded");
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteReport(reportId);

      setReports((prev) => prev.filter((report) => report._id !== reportId));

      toast.success("Report deleted successfully!");
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete report");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading medical history...</div>
      </div>
    );
  }

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
        {/* Conditions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Conditions</h2>
            <button
              onClick={() => setShowAddCondition(!showAddCondition)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {showAddCondition ? (
                <XIcon className="w-4 h-4" />
              ) : (
                <PlusIcon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {showAddCondition ? "Cancel" : "Add Condition"}
              </span>
            </button>
          </div>

          {showAddCondition && (
            <form
              onSubmit={handleAddCondition}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Condition Name"
                  value={newCondition.name}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Diagnosed Date (e.g. Jan 2024)"
                    value={newCondition.diagnosedDate}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        diagnosedDate: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <select
                    value={newCondition.status}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        status: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="managed">Managed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600"
                >
                  Save Condition
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {conditions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No conditions added yet
              </div>
            ) : (
              conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 ${condition.color || "bg-red-500"} rounded-full`}
                    ></div>
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${condition.status === "active" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {condition.status === "active" ? "Active" : "Managed"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Keep your medical conditions updated for
              accurate health insights and recommendations.
            </p>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reports</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <button
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                uploading
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {uploading ? "Analyzing..." : "Upload Report"}
              </span>{" "}
            </button>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No reports uploaded yet
              </div>
            ) : (
              reports.map((report, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedReport(report)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src={report.image}
                        alt={report.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-semibold text-gray-900">
                          {report.name}
                        </p>

                        <p className="text-sm text-gray-600">
                          {report.type} • {report.date}
                        </p>

                        {/* Findings */}
                        {report.analysis?.findings?.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-gray-700">
                              Findings
                            </div>

                            <ul className="list-disc ml-5 mt-1 text-xs text-red-600">
                              {report.analysis.findings.map(
                                (finding: string, idx: number) => (
                                  <li key={idx}>{finding}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Symptoms */}
                        {report.analysis?.symptoms?.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-gray-700">
                              Symptoms
                            </div>

                            <ul className="list-disc ml-5 mt-1 text-xs text-orange-600">
                              {report.analysis.symptoms.map(
                                (symptom: string, idx: number) => (
                                  <li key={idx}>{symptom}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Parameters */}
                        {report.parameters && (
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-gray-700 mb-1">
                              Parameters
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(report.parameters).map(
                                ([key, value], idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white border border-gray-200 rounded-md px-2 py-1"
                                  >
                                    <span className="font-medium text-gray-700">
                                      {key}
                                    </span>

                                    <span className="text-blue-600 ml-1">
                                      {String(value)}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* AI Summary */}
                        {(report.summary || report.analysis) && (
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-gray-700 mb-1">
                              AI Summary
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900 leading-relaxed whitespace-pre-wrap">
                              {report.summary ||
                                "AI analysis available in detailed view."}{" "}
                            </div>
                          </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-3 text-[11px] text-gray-500 italic">
                          This is not a diagnosis. Please consult a physician.
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(report);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <DownloadIcon className="w-5 h-5 text-gray-600" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report._id);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2Icon className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Medical Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {conditions.length === 0 && reports.length === 0 ? (
              <div className="pl-12 text-gray-400">No medical history yet</div>
            ) : (
              [...conditions, ...reports].slice(0, 5).map((item, index) => (
                <div key={index} className="relative flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      index % 3 === 0
                        ? "bg-emerald-500"
                        : index % 3 === 1
                          ? "bg-blue-500"
                          : "bg-purple-500"
                    }`}
                  >
                    <FileTextIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.diagnosedDate || item.date || "Date not specified"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.status
                        ? `Status: ${item.status}`
                        : `Type: ${item.type}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <XIcon className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedReport.name}
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              {selectedReport.type} • {selectedReport.date}
            </p>

            {/* Parameters */}
            {selectedReport.parameters && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Parameters
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedReport.parameters).map(
                    ([key, value], idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="text-sm font-medium text-gray-700">
                          {key}
                        </div>

                        <div className="text-lg font-bold text-blue-600">
                          {String(value)}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Findings */}
            {selectedReport.analysis?.findings?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Findings
                </h3>

                <ul className="list-disc ml-6 text-red-600 space-y-1">
                  {selectedReport.analysis.findings.map(
                    (finding: string, idx: number) => (
                      <li key={idx}>{finding}</li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* AI Summary */}
            {selectedReport.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  AI Summary
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
                  {selectedReport.summary}
                </div>
              </div>
            )}

            {/* Symptoms */}
            {selectedReport.analysis?.symptoms?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Symptoms
                </h3>

                <ul className="list-disc ml-6 text-orange-600 space-y-1">
                  {selectedReport.analysis.symptoms.map(
                    (symptom: string, idx: number) => (
                      <li key={idx}>{symptom}</li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* OCR TEXT */}
            {selectedReport.extractedText && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Extracted OCR Text
                </h3>

                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedReport.extractedText}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                This is not a diagnosis. Please consult a physician for
                confirmation and treatment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
