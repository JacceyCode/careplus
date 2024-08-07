import LoginForm from "@/components/forms/LoginForm";
import PasskeyModal from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Login({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <LoginForm />

          <div className="text-14-regular mt-14 flex items-center justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              &copy; {new Date().getFullYear()} CarePlus
            </p>

            <section className="flex items-center gap-3">
              <Link
                href="/"
                className="text-green-500 border rounded-md border-green-500 px-5 py-1 hover:text-white hover:bg-green-500 transition-all"
              >
                Sign Up
              </Link>
              <Link
                href="/?admin=true"
                className="text-green-500 hover:underline hover:text-white underline-offset-4 transition-all"
              >
                Admin
              </Link>
            </section>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
