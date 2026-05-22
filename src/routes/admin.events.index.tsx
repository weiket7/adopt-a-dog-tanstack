import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/admin/events/")({
  component: EventsTablePage,
});

const columnHelper = createColumnHelper<Doc<"events">>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => {
      const eventId = info.row.original._id;
      return (
        <Link
          to="/admin/events/$eventId"
          params={{ eventId }}
          className="font-weight-bold text-color-dark text-color-hover-primary"
        >
          {info.getValue()}
        </Link>
      );
    },
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("dateTime", {
    header: "Date / Time",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("link", {
    header: "Link",
    cell: (info) =>
      info.getValue() ? (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
          View
        </a>
      ) : null,
  }),
];

function EventsTablePage() {
  const { data: events } = useSuspenseQuery(convexQuery(api.events.list, {}));

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Events</h2>
        <Link to="/admin/events/$eventId" params={{ eventId: "add" }} className="btn btn-primary">
          Create Event
        </Link>
      </div>

      <table className="table table-striped table-hover border">
        <thead className="table-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {events.length === 0 && (
        <div className="text-center py-4">No events found.</div>
      )}
    </div>
  );
}
