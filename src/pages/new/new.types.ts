export interface FormInput {
  id: number;
  label: string;
  type: string;
  placeholder?: string;
}

export interface NewPageProps {
  inputs?: FormInput[];
  title?: string;
}
