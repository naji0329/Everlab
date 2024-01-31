import React from "react";
import { Patient_Data } from "src/type/Diagnostics";

type PatientsTableProps = {
  patients: Patient_Data[];
  switchModal: any;
  analyseData: (index: number) => void;
};

const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  switchModal,
  analyseData,
}) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200 text-xs leading-4 text-gray-500 uppercase tracking-wider">
          <th className="px-6 py-3 text-center font-medium">
            <input
              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              type="checkbox"
            />
          </th>
          <th className="px-6 py-3 text-center font-medium">Name</th>
          <th className="px-6 py-3 text-center font-medium">Birth</th>
          <th className="px-6 py-3 text-center font-medium">Sex</th>
          <th className="px-6 py-3 text-center font-medium">Address</th>
          <th className="px-6 py-3 text-center font-medium">Phone</th>
          <th className="px-6 py-3 text-center font-medium">
            Referring Doctor
          </th>
          <th className="px-6 py-3 text-center font-medium">
            Conslting Doctor
          </th>
          <th className="px-6 py-3 text-center font-medium">Status</th>
          <th className="px-6 py-3 text-center font-medium"></th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {patients.map((element, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <input
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                type="checkbox"
              />
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.name}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.birth}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.sex}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.address}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.phone}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.referring_doctor}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text-sm leading-5 text-gray-900">
                {element.consulting_doctor}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  element.analysed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {element.analysed ? "analysed" : "not analysed"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                onClick={() => {
                  element.analysed ? switchModal(index) : analyseData(index);
                }}
              >
                {element.analysed ? "View OBX" : "Analyse"}
              </button>
            </td>
          </tr>
        ))}
        {patients.length === 0 && (
          <tr>
            <td
              className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center"
              colSpan={10}
            >
              <div className="text-sm leading-5 text-gray-900">No data</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PatientsTable;
