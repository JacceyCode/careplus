"use client";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";
import StatusBadge from "../StatusBadge";
import { Appointment } from "@/types/appwrite.types";

export const userColumns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "schedule",
    header: "Appointment Date",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor!.image}
            alt={doctor!.name}
            width={100}
            height={100}
            className="size-8"
          />

          <p className="whitespace-nowrap"> Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const appointment = row.original;

      return <p className="text-14-medium">{appointment.reason}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          {data.status === "pending" && (
            <AppointmentModal
              type="cancel"
              patientId={data.patient.$id}
              userId={data.userId}
              appointment={data}
            />
          )}
        </div>
      );
    },
  },
];
