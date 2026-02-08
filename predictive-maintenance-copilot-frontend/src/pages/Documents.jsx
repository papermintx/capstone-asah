import React from "react";
import RagDocs from "../components/admin/RagDocs";

const Documents = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold">Manuals & SOPs</h1>
            <p className="text-lg opacity-90">Technical Guidelines & Maintenance Procedures</p>
        </div>
        <div className="p-6">
            <RagDocs />
        </div>
      </div>
    </div>
  );
};

export default Documents;