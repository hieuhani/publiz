import { Link } from "@tanstack/react-router";

export const SideBar: React.FunctionComponent = () => {
  return (
    <div className="px-2 py-2 flex flex-col h-full">
      <h3 className="text-white text-xl mb-3">Publiz</h3>
      <div className="flex-1 text-gray-300">
        <ul>
          <li>
            <Link
              to="/"
              className="py-2 flex px-3"
              activeProps={{
                className: "bg-gray-800 rounded-md",
              }}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex space-x-2">
        <div className="bg-purple-800 w-10 h-10 rounded-full grid place-content-center text-lg text-white">
          AG
        </div>

        <button className="bg-gray-800 w-full rounded-md  text-gray-200 flex-1">
          Sign out
        </button>
      </div>
    </div>
  );
};
