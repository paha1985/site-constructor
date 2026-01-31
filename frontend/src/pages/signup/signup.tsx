import { SignupForm } from "./components/signup-form";

interface SignupProps {
  onSubmit?: () => void;
}

export const Signup: React.FC<SignupProps> = () => {
  return <SignupForm />;
};

export default Signup;