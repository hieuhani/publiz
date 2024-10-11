import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

type Props = {
  className?: string;
};

export const LogoFull: React.FunctionComponent<Props> = ({ className }) => (
  <div className={cn("items-center flex space-x-3", className)}>
    <Logo className="text-5xl" />
    <h3 className="text-3xl text-white">Publiz</h3>
  </div>
);
