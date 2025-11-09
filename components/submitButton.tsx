import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function SubmitButton(props: { text: string }) {
  const status = useFormStatus();
  return <Button>{status.pending ? <Spinner /> : props.text}</Button>;
}
