import { SigninForm } from "./components/signin-form";

interface SigninProps {
  onSubmit?: () => void;
}

export const Signin: React.FC<SigninProps> = ({onSubmit}) => {
  return <SigninForm onSubmit={onSubmit}/>;
};

export default Signin;