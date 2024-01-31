import React, { useState, ChangeEvent } from "react";
import { Patient_Data } from "src/type/Diagnostics";
import PatientsTable from "../components/patientsTable";

const HL7Analysics = () => {
  let temp_patients: Patient_Data[] = [];
  const [cur_patient, setCurPatient] = useState<Patient_Data>(
    new Patient_Data()
  );
  const [patients, setPatients] = useState<Patient_Data[]>([]);
  const [analysing, setAnalysing] = useState<boolean>(false);
  const [modalopen, setModalopen] = useState<boolean>(false);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        const content = e.target?.result as string;
        // eslint-disable-next-line no-control-regex
        const updated_content = content.replace(/\x0D/g, "\n");
        const lines = updated_content.split("\n");
        processHL7Data(lines);
      };
      fileReader.readAsText(file);
    }
  };

  const clearString = (input_string: string, encoding_data: string) => {
    const escapedStr2 = encoding_data.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("[" + escapedStr2 + "]", "g");
    return input_string.replace(regex, " ");
  };

  const calculateAge = (birthdateString: string) => {
    const today = new Date();
    const birthYear = parseInt(birthdateString.substring(0, 4));
    const currentYear = today.getFullYear();
    const age = currentYear - birthYear;
    return age;
  };

  const processHL7Data = async (lines: string[]) => {
    let patient_str = "";
    let patient_data: Patient_Data = new Patient_Data();
    temp_patients = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const result = line.split("|");
      switch (result[0]) {
        case "MSH":
          if (patient_str !== "") {
            patient_data.oru_data = patient_str;
            temp_patients.push(patient_data);
            patient_str = "";
            patient_data = new Patient_Data();
          }
          patient_data.encoding_data = result[1];
          break;
        case "PID":
          patient_data.name = clearString(
            result[5],
            patient_data.encoding_data
          );
          patient_data.birth = clearString(
            result[7],
            patient_data.encoding_data
          );
          patient_data.age = calculateAge(patient_data.birth);

          patient_data.sex = clearString(result[8], patient_data.encoding_data);
          patient_data.address = clearString(
            result[11],
            patient_data.encoding_data
          );
          patient_data.phone = clearString(
            result[13],
            patient_data.encoding_data
          );
          break;
        case "PV1":
          patient_data.referring_doctor = clearString(
            result[8],
            patient_data.encoding_data
          );
          patient_data.consulting_doctor = clearString(
            result[9],
            patient_data.encoding_data
          );
          break;
        case "OBX":
          patient_str += line + "\n";
          break;
      }
    }
    temp_patients.push(patient_data);
    setPatients(temp_patients);
  };

  const analyseData = async (index: number) => {
    if (analysing) {
      return;
    }
    setAnalysing(true);
    const api_url: string = "http://localhost:8080/api/v1/analyse";
    const response = await fetch(api_url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: patients[index] }), // body data type must match "Content-Type" header
    });
    const data = await response.json();
    let patient = patients[index];
    patient.metrics = data.metrics;
    patient.conditions = data.conditions;
    patient.analysed = true;
    console.log(data.conditions);
    const updatedPatients = [...patients]; // Create a copy of the original array
    updatedPatients[index] = patient; // Replace the nth element with the new value
    setPatients(updatedPatients);
    setAnalysing(false);
  };

  const switchModal = (index: number) => {
    if (!modalopen) {
      setCurPatient(patients[index]);
    }
    setModalopen(!modalopen);
  };

  return (
    <>
      <div className="w-100 mt-8 flex flex-col justify-center items-center">
        <div className="w-full">
          <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <div className="mb-4">
                <h1 className="text-3xl font-bolder leading-tight text-gray-900">
                  Patients Data
                </h1>
              </div>
              <div className="-mb-2 py-4 flex flex-wrap flex-grow justify-end">
                <div className="flex items-center py-2">
                  <div className="flex justify-end items-center">
                    <label>
                      <button
                        type="button"
                        className="btn-outline-primary transition duration-300 ease-in-out focus:outline-none focus:shadow-outline border border-purple-700 hover:bg-purple-700 text-purple-700 hover:text-white font-normal py-2 px-4 rounded"
                      >
                        <label>
                          Import New Data
                          <input
                            type="file"
                            className="hidden"
                            accept="*.*"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </button>
                    </label>
                  </div>
                </div>
              </div>
              <div className="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="align-middle inline-block w-full shadow overflow-x-auto sm:rounded-lg border-b border-gray-200">
                  <PatientsTable
                    patients={patients}
                    switchModal={switchModal}
                    analyseData={analyseData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalopen && (
        <div className="fixed z-10 top-0 w-full left-0">
          <div className="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <span className="sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div
              className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-[50%]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h1 className="font-semibold text-2xl">
                  Patient OBX Recognition Result
                </h1>
                <div className="flex flex-col mt-3">
                  <p className="font-medium text-xl text-gray-800">
                    Name :<span className="w-full">{cur_patient.name}</span>
                  </p>
                  <p className="font-medium text-xl text-gray-800">
                    Birthday :
                    <span className="w-full">{cur_patient.birth}</span>
                  </p>
                  <p className="font-medium text-xl text-gray-800">
                    Sex : <span className="w-full">{cur_patient.sex}</span>
                  </p>
                  <p className="font-medium text-xl text-gray-800">
                    Address :
                    <span className="w-full">{cur_patient.address}</span>
                  </p>
                  <br />
                  <p className="font-medium text-gray-800">Diagnostics Data:</p>
                  <div className="max-h-80 overflow-y-auto ">
                    {cur_patient.metrics.map((element, index) => (
                      <div className="bg-gray-100 w-100 m-1 p-2" key={index}>
                        <p className="font-medium text-gray-800">
                          Diagnostic Metric :
                          <span className="w-full">{element.name}</span>
                        </p>
                        <p className="font-medium text-gray-800">
                          Diagnostic Name :
                          <span className="w-full">{element.diagnostic}</span>
                        </p>
                        <p className="font-medium text-gray-800">
                          Diagnostic Group :
                          <span className="w-full">
                            {element.diagnostic_groups}
                          </span>
                        </p>
                        <p className="font-medium text-gray-800">
                          Result Value :
                          <span className="w-full">{element.value}</span>
                        </p>
                        <p className="font-medium text-gray-800">
                          Standard Range :
                          <span className="w-full">
                            {element.standard_lower} - {element.standard_higher}
                          </span>
                        </p>
                        <p className="font-medium text-gray-800">
                          Everlab Range :
                          <span className="w-full">
                            {element.everlab_lower} - {element.everlab_higher}
                          </span>
                        </p>
                        <p className="font-medium text-gray-800">
                          Status :
                          <span
                            className={`w-full ${
                              !cur_patient.conditions[index].status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-200 text-red-800"
                            }}`}
                          >
                            {!cur_patient.conditions[index].status
                              ? "Great"
                              : "Abnormal"}
                          </span>
                        </p>
                        {cur_patient.conditions[index].status && (
                          <>
                            <p className="font-medium text-gray-800">
                              StatusMessage :
                              <span className={`w-full`}>
                                {cur_patient.conditions[index].message}
                              </span>
                            </p>
                            <p className="font-medium text-gray-800">
                              IllnessName :
                              <span className={`w-full text-red-900`}>
                                {cur_patient.conditions[index].name ??
                                  "Condition not found."}
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 px-4 py-3 text-right">
                <button
                  type="button"
                  className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                  onClick={() => switchModal(0)}
                >
                  <i className="fas fa-times"></i> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HL7Analysics;
