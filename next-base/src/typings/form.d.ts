export interface DynamicFormProps {
  data: FormData[];
  meta: {
    csrfToken: string;
  };
}

export interface FormData {
  id: number;
  FormName: string;
  FormID: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
  FormCSFRTokenExpiry: null;
  FormFields: FormField[];
  useCaptcha?: boolean;
  FormDescription: string | null;
  FormRedirect: FormRedirect;
  AfterSubmission: {
    Type: "message" | "link";
    Message: string;
    Link: string;
  };
}

export interface FormRedirect {
  data: {
    id: number;
    attributes: {
      title: string;
      subtitle: string;
      content: string;
      type: string;
      route: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
    };
  };
}

export interface FormField {
  id: number;
  Type: string;
  Mandatory: boolean;
  hideLabel: boolean;
  HalfWidth: boolean;
  customErrorMessage: null;
  Label: string;
  Placeholder?: string;
  Description?: string;
  SubmissionKey: string;
  formOrder: null;
  maxFiles: null;
  parentSubmissionKey: null | string;
  width?: string;
  initailValue?: string | number | null;
  SelectOptions: Array<{
    id: number;
    Label: string;
    Value: string;
    SendToEmail: string;
    isDefault?: boolean;
  }>;
  Validations: {
    ErrorMessage: string;
    MaxFiles?: number;
  };
}
