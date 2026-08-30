import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, EmptyState } from "../components/ui";
import ClientTable from "../components/clients/ClientTable";
import { clients } from "../data/mock/data";
import { csvEscape, downloadCsv, PageHeading } from "./pageShared";

const PAGE_SIZE = 5;

function pageList(total, current) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("…");
  for (
    let page = Math.max(2, current - 1);
    page <= Math.min(total - 1, current + 1);
    page++
  ) {
    pages.push(page);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const shown = clients.filter((client) =>
    `${client.name} ${client.id} ${client.city}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = shown.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const rangeStart = shown.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, shown.length);
  const changeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };
  const exportCsv = () =>
    downloadCsv("clients.csv", [
      "clientId,name,location,totalAssets,status",
      ...shown.map((client) =>
        [
          csvEscape(client.id),
          csvEscape(client.name),
          csvEscape(`${client.city}, ${client.postalCode}`),
          csvEscape(client.totalAssets),
          csvEscape(client.status),
        ].join(","),
      ),
    ]);
  return (
    <>
      <PageHeading
        title="Clients"
        subtitle="Manage the complete bank customer base."
        action={
          <Button onClick={() => navigate("/clients/new")}>
            <Plus size={17} /> Add client
          </Button>
        }
      />
      <Card className="table-card">
        <div className="ct-toolbar">
          <div className="search compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Search clients…"
            />
          </div>
          <div className="ct-toolbar-right">
            <button className="export-btn" onClick={exportCsv} type="button">
              <Download size={16} />
              Export
            </button>
            <span className="results-count">
              {shown.length
                ? `Showing ${rangeStart}-${rangeEnd} of ${shown.length} clients`
                : "No clients found"}
            </span>
          </div>
        </div>
        {shown.length ? (
          <>
            <ClientTable clients={pageItems} />
            <div className="ct-pagination">
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>
              <div className="page-numbers">
                {pageList(totalPages, currentPage).map((entry, index) =>
                  typeof entry === "number" ? (
                    <button
                      key={entry}
                      type="button"
                      className={
                        entry === currentPage ? "page-num active" : "page-num"
                      }
                      onClick={() => setPage(entry)}
                    >
                      {entry}
                    </button>
                  ) : (
                    <span key={`ellipsis-${index}`} className="page-ellipsis">
                      {entry}
                    </span>
                  ),
                )}
              </div>
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="No clients found"
            detail="Try adjusting your search."
          />
        )}
      </Card>
    </>
  );
}
