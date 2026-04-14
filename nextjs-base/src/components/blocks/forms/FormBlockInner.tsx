"use client";

import type { FormData } from "@/typings/form";
import ReCAPTCHA from "react-google-recaptcha";
import { SubmitHandler, useForm } from "react-hook-form";

import { useCurrentLocale, useI18n } from "@/app/locales/client";
import FormRenderer from "@/components/blocks/forms/FormRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useState } from "react";

export interface FormBlockInnerProps {
  formDetails: FormData;
  formInfo: {
    id: number;
    csrfToken: string;
  };
}

const FormBlockInner = ({ formDetails, formInfo }: FormBlockInnerProps) => {
  const lang = useCurrentLocale();
  const t = useI18n();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: {
      requestDate: new Date(),
    },
  });

  // TODO: Use server actions https://nextjs.org/docs/app/guides/forms
  const onSubmit: SubmitHandler<any> = async (data) => {
    let token: string | null = "";
    if (formDetails?.useCaptcha) {
      if (!recaptchaRef.current) return;
      token = await recaptchaRef.current.executeAsync();
    }
    const transformedData = Object.entries(data)?.map(([key, value]) => ({
      key,
      value,
    }));

    const formBody = {
      formType: formDetails?.id,
      // csrfToken: formInfo?.csrfToken,
      jsonSubmission: transformedData,
      XCaptcha: formDetails?.useCaptcha ? token : "",
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(formBody));

    if (isSubmitting) return;
    const response: any = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/strapi-v4-form-builder/submit-form`,
        {
          headers: {
            // Authorization: `Bearer ${session?.accessToken}`,
          },
          method: "POST",
          body: formData,
        },
      )
    ).json();

    if (response?.id) {
      setIsSubmitted(true);
      if (!containerRef.current) return;
      const offset = containerRef.current.getBoundingClientRect();

      window.scroll({
        top: offset.top + window.scrollY - 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="relative size-full scroll-m-48"
      id="form-section"
      ref={containerRef}
    >
      {isSubmitted ? (
        <div className="flex size-full flex-col items-center justify-center">
          {/* <h3 className="mb-8 text-center uppercase">
            {formDetails?.formRedirect?.data?.title}
          </h3>
          <div className="mb-16">
            <p className="text-center">
              {formDetails?.formRedirect?.data?.content}
            </p>
          </div> */}
          <Link href={`/${lang}/`}> Back to home </Link>
        </div>
      ) : (
        <>
          <form
            className="flex flex-wrap justify-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* {formDetails?.formFields?.map(getFormFields)} */}
            <FormRenderer
              control={control}
              formFields={formDetails?.FormFields}
              register={register}
            />
            {formDetails?.useCaptcha ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY as string}
                size="invisible"
              />
            ) : null}
          </form>
          <div className="mt-8 text-start">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="hover:text-beige border border-black/25 uppercase"
              type="submit"
            >
              <span className="z-2 text3 relative uppercase">Submit</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FormBlockInner;
