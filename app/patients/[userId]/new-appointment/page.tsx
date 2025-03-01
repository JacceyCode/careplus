import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewAppointment({
  params: { userId },
}: SearchParamProps) {
  const patient = await getPatient(userId);

  Sentry.metrics.set("user_view_new-appointment", patient?.name);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {patient ? (
            <AppointmentForm
              type="create"
              userId={userId}
              patientId={patient?.$id}
            />
          ) : (
            <section className="mb-12 flex flex-col gap-4 items-center">
              <h1 className="text-16-semibold text-center">
                Patient&apos;s medical record not found. Please create file.
              </h1>
              <Button variant="outline" className="shad-primary-btn" asChild>
                <Link href={`/patients/${userId}/register`}>
                  Create Patient&apos;s file
                </Link>
              </Button>
            </section>
          )}

          <p className="copyright mt-10 py-12">
            &copy; {new Date().getFullYear()} CarePlus
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
