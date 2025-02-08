import React from "react";
import "../styles/Pagination.css";
import { CaretRightFill, CaretLeftFill } from "react-bootstrap-icons";

const Pagination = ({
  page,
  totalPages,
  limit,
  totalResults,
  onPageChange,
  onLimitChange,
}) => {
  const pageNumbers = [];
  const maxPagesToShow = 2;

  if (page > 1 + maxPagesToShow) {
    pageNumbers.push(1, "...");
  }

  for (let i = Math.max(1, page - maxPagesToShow); i < page; i++) {
    pageNumbers.push(i);
  }

  pageNumbers.push(page);

  for (
    let i = page + 1;
    i <= Math.min(totalPages, page + maxPagesToShow);
    i++
  ) {
    pageNumbers.push(i);
  }

  if (page < totalPages - maxPagesToShow) {
    pageNumbers.push("...", totalPages);
  }

  return (
    <div className="pagination-container">
      <div className="results-info">
        Showing {(page - 1) * limit + 1} -{" "}
        {Math.min(page * limit, totalResults)} of {totalResults} results
      </div>

      <div className="limit-selector">
        <label>Show: </label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
        >
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>

      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <CaretLeftFill size={20} />
        </button>

        {pageNumbers.map((num, index) =>
          num === "..." ? (
            <span key={index} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={num === page ? "active" : ""}
              onClick={() => onPageChange(num)}
            >
              {num}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <CaretRightFill size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
