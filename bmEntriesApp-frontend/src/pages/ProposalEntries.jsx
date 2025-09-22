import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ViewSubmissions.css";

export default function ProposalEntries() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://vercel-backend-vnvy.onrender.com/api/admin/submissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Export submissions to Excel
  const exportToExcel = () => {
    if (!submissions.length) {
      toast.info("No data to export");
      return;
    }

    // Map submissions to flat data for excel
    const dataForExcel = submissions.map((s, idx) => ({
      "#": idx + 1,
      "Branch": s.branch,
      "Branch Code": s.branchCode,
      "FO Name": s.foName,
      "Date": new Date(s.date).toLocaleDateString(),
      "Village": s.village,
      "Group Name": s.groupName,
      "Group Code": s.groupCode,
      "Member Name": s.memberName,
      "Co-Applicant Name": s.coApplicantName || "-",
      "Mobile Number": s.mobileNumber,
      "Loan Amount (₹)": s.loanAmount,
      "KYC Collected": s.kycCollected.join(", "),
      "Product Name": s.product?.name,
      "Product Amount (₹)": s.product?.amount,
      "Remarks": s.remarks || "-",
      "Customer Name": s.customer?.name || "-",
      "Customer Email": s.customer?.email || "-",
      "Created At": new Date(s.createdAt).toLocaleString(),
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

    // Write workbook buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create Blob and trigger save
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `submissions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="view-submissions-container">
      <h2 className="neon-title">📄 Proposal Entries</h2>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {loading ? (
        <div className="loading-text">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="no-data">No submissions found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Branch</th>
                <th>Branch Code</th>
                <th>FO Name</th>
                <th>Date</th>
                <th>Village</th>
                <th>Group Name</th>
                <th>Group Code</th>
                <th>Member Name</th>
                <th>Co-Applicant Name</th>
                <th>Mobile Number</th>
                <th>Loan Amount</th>
                <th>KYC Collected</th>
                <th>Product Name</th>
                <th>Product Amount</th>
                <th>Remarks</th>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission._id}>
                  <td>{index + 1}</td>
                  <td>{submission.branch}</td>
                  <td>{submission.branchCode}</td>
                  <td>{submission.foName}</td>
                  <td>{new Date(submission.date).toLocaleDateString()}</td>
                  <td>{submission.village}</td>
                  <td>{submission.groupName}</td>
                  <td>{submission.groupCode}</td>
                  <td>{submission.memberName}</td>
                  <td>{submission.coApplicantName || "—"}</td>
                  <td>{submission.mobileNumber}</td>
                  <td>₹{submission.loanAmount}</td>
                  <td>{submission.kycCollected.join(", ")}</td>
                  <td>{submission.product?.name}</td>
                  <td>₹{submission.product?.amount}</td>
                  <td>{submission.remarks || "—"}</td>
                  <td>{submission.customer?.name || "—"}</td>
                  <td>{submission.customer?.email || "—"}</td>
                  <td>{new Date(submission.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
