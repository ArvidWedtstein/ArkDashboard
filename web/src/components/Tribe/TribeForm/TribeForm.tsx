import {
  Form,
  FormError,
} from "@redwoodjs/forms";

import type { CreateTribeInput, Tribe, UpdateTribeInput } from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import { useAuth } from "src/auth";
import { permission } from ".prisma/client";
import { Input } from "src/components/Util/Input/Input";
type FormTribe = NonNullable<Tribe>;

interface TribeFormProps {
  tribe?: FormTribe & {
    [key: string]: any
  };
  onSave: (data: UpdateTribeInput | CreateTribeInput, id?: FormTribe["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const TribeForm = (props: TribeFormProps) => {
  const { currentUser, isAuthenticated } = useAuth();

  const onSubmit = (data: FormTribe) => {
    if (
      // hasRole("f0c1b8e9-5f27-4430-ad8f-5349f83339c0") ||
      isAuthenticated &&
      currentUser?.permissions?.includes(
        props?.tribe?.id ? "tribe_update" : ("tribe_create" as permission)
      )
    ) {
      data.created_by = props.tribe?.created_by || currentUser?.id.toString();
      props.onSave(data, props?.tribe?.id);
    }
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormTribe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Input
          name="name"
          label="Name"
          defaultValue={props.tribe?.name}
          color="DEFAULT"
        />
      </Form>
    </div>
  );
};

export default TribeForm;
