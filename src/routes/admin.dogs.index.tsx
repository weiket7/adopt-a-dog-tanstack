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

export const Route = createFileRoute("/admin/dogs/")({
  component: DogsTablePage,
});

const columnHelper = createColumnHelper<Doc<"dogs">>();

// Define your columns
const columns = [
  columnHelper.accessor("name", {
    header: () => <span>Name</span>,
    cell: (info) => {
      // Get the current dog's _id from the row data
      const dogId = info.row.original._id;

      return (
        <Link
          to="/admin/dogs/$dogId"
          params={{ dogId }}
          className="font-weight-bold text-color-dark text-color-hover-primary"
        >
          {info.getValue()}
        </Link>
      );
    },
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => (
      <span>
        <i
          className={info.getValue() === "Male" ? "fa fa-mars" : "fa fa-venus"}
        />{" "}
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("birthday", {
    header: "Age",
    cell: (info) => <span>{info.getValue()}</span>, // You can wrap your toAge() function here
  }),
  columnHelper.accessor("hdbApproved", {
    header: "HDB Approved",
    cell: (info) => (
      <span
        className={`badge ${info.getValue() === "Yes" ? "bg-success" : "bg-danger"}`}
      >
        {info.getValue()}
      </span>
    ),
  }),
];

function DogsTablePage() {
  const { data: dogs } = useSuspenseQuery(convexQuery(api.dogs.all, {}));

  const table = useReactTable({
    data: dogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dogs for Adoption</h2>
      </div>

      <table className="table table-striped table-hover border">
        <thead className="table-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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

      {dogs.length === 0 && (
        <div className="text-center py-4">No dogs found.</div>
      )}
    </div>
  );
}
