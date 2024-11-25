import { Link } from "@tanstack/react-router";
import {
  Building2,
  Computer,
  Files,
  ListTree,
  Newspaper,
  SmilePlus,
  SwatchBook,
  Tags,
  Users,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "./ui/scroll-area";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCurrentOrganization } from "@/contexts/CurrentOrganizationContext";

const routes = [
  {
    link: "/",
    title: "Dashboard",
    icon: <Computer />,
  },
  {
    link: "/taxonomies",
    title: "Taxonomies",
    icon: <ListTree />,
  },
  {
    link: "/meta-schemas",
    title: "Meta Schemas",
    icon: <SwatchBook />,
  },
  {
    link: "/reaction-packs",
    title: "Reaction packs",
    icon: <SmilePlus />,
  },

  {
    link: "/users",
    title: "Users",
    icon: <Users />,
  },
  {
    link: "/posts",
    title: "Posts",
    icon: <Newspaper />,
  },
  {
    link: "/organizations",
    title: "Organizations",
    icon: <Building2 />,
  },
  {
    link: "/tags",
    title: "Tags",
    icon: <Tags />,
  },
  {
    link: "/files",
    title: "Files",
    icon: <Files />,
  },
];

export const SideBar: React.FunctionComponent = () => {
  const auth = useAuth();
  const currentUser = useCurrentUser();
  const { isSystem, organization } = useCurrentOrganization();
  return (
    <div className="px-2 py-2 flex flex-col h-full w-60 bg-zinc-950">
      <div className="flex items-center space-x-2 mb-4">
        <Logo className="text-4xl" />
        <h3 className="text-white text-2xl">Publiz</h3>
      </div>
      <ScrollArea className="h-[calc(100%-52px)]">
        <div className=" text-gray-300">
          <ul>
            {routes.map((route) => (
              <li key={route.link}>
                <Link
                  to={`/${organization?.slug || "-"}/${route.link}`}
                  className="py-3 flex px-3 space-x-3 items-center"
                  activeProps={{
                    className: "bg-zinc-800 rounded-md",
                  }}
                  activeOptions={{
                    exact: true,
                  }}
                >
                  {route.icon}
                  <span>{route.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-purple-800 w-10 h-10 rounded-full grid place-content-center text-lg text-white">
              {currentUser.displayName?.[0] || "P"}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={auth.signOut}
              className="cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="text-left">
              <h4 className="font-medium">
                {isSystem ? "System" : organization?.name}
              </h4>
              <p className="text-sm line-clamp-1">
                {isSystem ? "System management" : organization?.description}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Your organization</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <Link to="/">Switch organization</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
