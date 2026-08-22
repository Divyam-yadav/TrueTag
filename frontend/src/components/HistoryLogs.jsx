import React from "react";

export default function HistoryLogs({ logs, onRefresh }) {
  return (
    <div className="card history-card">
      <div className="history-header">
        <div>
          <h2 className="section-title">3. Audit History (MongoDB)</h2>
          <p className="section-description">
            Live compliance records stored in <code>compliance_logs</code>{" "}
            collection
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
        >
          🔄 Refresh Logs
        </button>
      </div>

      {!logs || logs.length === 0 ? (
        <div className="empty-history">
          <p>
            No audit scans logged yet. Upload an image above to perform your
            first scan.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Image File</th>
                <th>Status</th>
                <th>Rules Met</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry, index) => {
                const isPass = entry.status === "Pass";
                const rulesCount = entry.rules
                  ? Object.values(entry.rules).filter(Boolean).length
                  : "-";
                const formattedTime = entry.timestamp
                  ? new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "Just now";

                return (
                  <tr key={index}>
                    <td className="time-cell">{formattedTime}</td>
                    <td className="file-cell" title={entry.filename}>
                      {entry.filename || "Upload"}
                    </td>
                    <td>
                      <span
                        className={`mini-badge ${isPass ? "mini-pass" : "mini-fail"}`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="rules-cell">{rulesCount}/5 Rules</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
