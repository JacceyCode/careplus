import StatCard from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { userColumns } from "@/components/table/userColumns";
import { Button } from "@/components/ui/button";
import { getUserAppointmentList } from "@/lib/actions/appointment.actions";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

const Dashboard = async ({ params: { userId } }: SearchParamProps) => {
  const [user, appointments] = await Promise.all([
    getUser(userId),
    getUserAppointmentList(userId),
  ]);

  const userName = user?.name.split(" ")[0];
  const firstName =
    userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Personal Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full flex flex-col md:flex-row md:justify-between gap-4">
          <section className="space-y-4">
            <h1 className="header">Welcome {firstName} 👋</h1>
            <p className="text-dark-700">
              Check the details of your appointments.
            </p>
          </section>

          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </Button>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={userColumns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Dashboard;
