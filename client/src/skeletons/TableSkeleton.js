import "../styles/TableSkeleton.css";

const TableSkeleton = ({ rows }) => {
  return (
    <table className="applications-table">
      <thead>
        <tr>
          {[
            "Modify",
            "Company",
            "Position",
            "Date",
            "Location",
            "Job",
            "Status",
            "Source",
            "Work",
          ].map((header, index) => (
            <th key={index}>
              <div className="applications-table-skeleton applications-table-skeleton-header"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, index) => (
          <tr key={index}>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-icon"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
            <td>
              <div className="applications-table-skeleton applications-table-skeleton-text"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
