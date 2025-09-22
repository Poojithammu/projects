import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403 - Unauthorized</h1>
      <p style={styles.message}>You do not have permission to view this page.</p>
      <button style={styles.button} onClick={() => navigate(-1)}>
        Go Back
      </button>
      <button style={styles.button} onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a3d62",
    color: "#fff",
    padding: 20,
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    marginBottom: 10,
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0050d1",
    color: "white",
    border: "none",
    padding: "10px 20px",
    margin: "5px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Unauthorized;
