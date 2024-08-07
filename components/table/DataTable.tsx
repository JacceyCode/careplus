"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  const [label, setLabel] = useState("all");

  return (
    <>
      {data.length > 0 && (
        <div className="data-table">
          <div className="mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-24">
                  {label.toUpperCase()}
                  <ChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#1e2238]">
                <DropdownMenuRadioGroup
                  value={table.getColumn("status")?.getFilterValue() as string}
                  onValueChange={(value) => {
                    table.getColumn("status")?.setFilterValue(value);
                    value ? setLabel(value) : setLabel("all");
                  }}
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="pending">
                    Pending
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="cancelled">
                    Cancelled
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="scheduled">
                    Scheduled
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Table className="shad-table">
            <TableHeader className="bg-dark-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="shad-table-row-header"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="shad-table-row"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="table-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="shad-gray-btn"
            >
              <Image
                src="/assets/icons/arrow.svg"
                width={24}
                height={24}
                alt="arrow"
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="shad-gray-btn"
            >
              <Image
                src="/assets/icons/arrow.svg"
                width={24}
                height={24}
                alt="arrow"
                className="rotate-180"
              />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
