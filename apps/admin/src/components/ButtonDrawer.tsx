import { PropsWithChildren, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";

type Props = PropsWithChildren<{
  content: (close: () => void) => React.ReactNode;
  title: string;
  description?: string;
}>;

export const ButtonDrawer: React.FunctionComponent<Props> = ({
  content,
  children,
  title,
  description,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="right-0 top-0 bottom-0 left-auto mt-0 w-96">
        <div className="mx-auto w-full max-w-sm h-full">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>

          <ScrollArea className="px-2 h-[calc(100%-55px)]">
            <div className="px-2">{content(() => setOpen(false))}</div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
