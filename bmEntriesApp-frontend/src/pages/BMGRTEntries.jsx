import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ViewSubmissions.css";

export default function BMGRTEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://vercel-backend-vnvy.onrender.com/api/admin/bm-entries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch BMGRT entries");
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
      "FO Name": e.foName,
      "Group Name": e.groupName,
      "Group Code": e.groupCode,
      "Member Name": e.memberName,
      "Loan Amount (₹)": e.loanAmount,
      "Insurance Amount (₹)": e.insuranceAmount,
      "Disbursement Amount (₹)": e.disbursementAmount,
      "EMI (₹)": e.emi,
      "Products": e.products.map((p) => `${p.name} (₹${p.amount})`).join(", "),
      "Disbursement Date": new Date(e.disbursementDate).toLocaleDateString(),
      "BM Remarks": e.bmRemarks || "-",
      "Customer Name": e.createdBy?.name || "-",
      "Customer Email": e.createdBy?.email || "-",
      "Created At": new Date(e.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BMGRT Entries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `bmgrt_entries_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="view-submissions-container">
      <h2 className="neon-title">📄 BMGRT Entries</h2>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {loading ? (
        <div className="loading-text">Loading entries...</div>
      ) : entries.length === 0 ? (
        <div className="no-data">No BMGRT entries found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Branch</th>
                <th>Branch Code</th>
                <th>FO Name</th>
                <th>Group Name</th>
                <th>Group Code</th>
                <th>Member Name</th>
                <th>Loan Amount</th>
                <th>Insurance Amount</th>
                <th>Disbursement Amount</th>
                <th>EMI</th>
                <th>Products</th>
                <th>Disbursement Date</th>
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
                  <td>{entry.foName}</td>
                  <td>{entry.groupName}</td>
                  <td>{entry.groupCode}</td>
                  <td>{entry.memberName}</td>
                  <td>₹{entry.loanAmount}</td>
                  <td>₹{entry.insuranceAmount}</td>
                  <td>₹{entry.disbursementAmount}</td>
                  <td>₹{entry.emi}</td>
                  <td>
                    {entry.products.map((p, i) => (
                      <div key={i}>
                        {p.name} (₹{p.amount})
                      </div>
                    ))}
                  </td>
                  <td>{new Date(entry.disbursementDate).toLocaleDateString()}</td>
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
