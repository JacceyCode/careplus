"use client";

import { Form } from "@/components/ui/form";
import { loginUser } from "@/lib/actions/patient.actions";
import { LoginFormValidation } from "@/lib/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ email }: z.infer<typeof LoginFormValidation>) {
    setIsLoading(true);
    setError(null);

    try {
      const user = await loginUser(email);

      const userId = user.userId || user.$id;

      router.push(`/patients/${userId}`);
    } catch (error: any) {
      console.error(error);
      setError("An unexpected error occurred. Please try again or signup.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome back 👋</h1>
          <p className="text-dark-700">You can schedule a new appointment.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@test.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        {error && <p className="shad-error">{error}</p>}

        <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
      </form>
    </Form>
  );
};

export default LoginForm;
