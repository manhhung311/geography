import Link from "next/link";

import { Badge } from "antd";

type Props = {
  name?: string;
  icon?: any;
  href: string;
  active: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: boolean;
};
const MenuSideBarItem = (props: Props) => {
  return (
    <Link
      href={props.href}
      className={`block  hover:bg-cyan-200 ${
        props.active ? " bg-blue-800 text-white" : " text-black"
      }`}
      onClick={props.onClick}
    >
      <div className="relative flex items-center justify-start gap-2 p-3">
        {!props.collapsed && (
          <h2
            className={`leading-6 text-base font-bold ${
              props.active ? " text-white" : " text-black"
            }`}
          >
            {props.name}
          </h2>
        )}
        {props.badge && (
          <div
            className={`${
              props.collapsed
                ? "absolute top-1 right-1 h-2 flex items-center overflow-hidden"
                : "ml-auto"
            }`}
          >
            <Badge dot status="processing" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default MenuSideBarItem;
