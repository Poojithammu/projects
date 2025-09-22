import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ViewSubmissions.css";

export default function DisbursementEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://vercel-backend-vnvy.onrender.com/api/admin/disbursement-entries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch disbursement entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const exportToExcel = () => {
    if (!entries.length) {
      toast.info("No data to export");
      return;
    }

    const dataForExcel = entries.map((e, idx) => ({
      "#": idx + 1,
      "Branch": e.branch,
      "Branch Code": e.branchCode,
      "Group ID": e.groupId,
      "Account Holder Name": e.accountHolderName,
      "Account Number": e.accountNumber,
      "IFSC Code": e.ifscCode,
      "Bank Branch": e.bankBranch,
      "Mobile Number": e.mobileNumber,
      "Loan Amount (₹)": e.loanAmount,
      "Insurance Amount (₹)": e.insuranceAmount,
      "Disbursement Amount (₹)": e.disbursementAmount,
      "EMI (₹)": e.emi,
      "Products": e.products.map((p) => `${p.name} (₹${p.amount})`).join(", "),
      "FO Name": e.foName,
      "BM Remarks": e.bmRemarks || "-",
      "Customer Name": e.createdBy?.name || "-",
      "Customer Email": e.createdBy?.email || "-",
      "Created At": new Date(e.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursement Entries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `disbursement_entries_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="view-submissions-container">
      <h2 className="neon-title">📄 Disbursement Entries</h2>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {loading ? (
        <div className="loading-text">Loading entries...</div>
      ) : entries.length === 0 ? (
        <div className="no-data">No disbursement entries found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Branch</th>
                <th>Branch Code</th>
                <th>Group ID</th>
                <th>Account Holder Name</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>Bank Branch</th>
                <th>Mobile Number</th>
                <th>Loan Amount</th>
                <th>Insurance Amount</th>
                <th>Disbursement Amount</th>
                <th>EMI</th>
                <th>Products</th>
                <th>FO Name</th>
                <th>BM Remarks</th>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry._id}>
                  <td>{index + 1}</td>
                  <td>{entry.branch}</td>
                  <td>{entry.branchCode}</td>
                  <td>{entry.groupId}</td>
                  <td>{entry.accountHolderName}</td>
                  <td>{entry.accountNumber}</td>
                  <td>{entry.ifscCode}</td>
                  <td>{entry.bankBranch}</td>
                  <td>{entry.mobileNumber}</td>
                  <td>₹{entry.loanAmount}</td>
                  <td>₹{entry.insuranceAmount}</td>
                  <td>₹{entry.disbursementAmount}</td>
                  <td>₹{entry.emi}</td>
                  <td>
                    {entry.products.map((p, i) => (
                      <div key={i}>{p.name} (₹{p.amount})</div>
                    ))}
                  </td>
                  <td>{entry.foName}</td>
                  <td>{entry.bmRemarks || "—"}</td>
                  <td>{entry.createdBy?.name || "—"}</td>
                  <td>{entry.createdBy?.email || "—"}</td>
                  <td>{new Date(entry.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
