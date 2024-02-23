"use client";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import MenuSideBarItem from "../MenuSideBarItem";
import SideBarLogo from "../SideBarLogo";
import { Select } from "antd";
import ND from "../../ND.json";
import Category from "../../category.json";
type IG = {
  collapsed?: boolean;
  onChange:(select: string, field: string)=> void
};

const SidebarMenu = ({ collapsed = false, onChange }: IG) => {
  const [field, setField] = useState<string>(Category.data[0].id);
  const [select, setSelect] = useState<string>(ND.Nam_Dinh.districts[0].id);
  const TopMenuItems: any[] = Category.data.map((item) => {
    return {
      name: item.name,
      id: item.id,
      onClick: () => {
        setField(item.id);
      },
    };
  });
  //   {
  //     icon: "home",
  //     name: "trans.sidebar.home",
  //     href: "/",
  //   },
  //   {
  //     icon: "message",
  //     name: "trans.sidebar.message",
  //     href: "/message",
  //     notification: hasNotification,
  //     onClick: () => {},
  //   },
  //   {
  //     icon: "statistics",
  //     name: "trans.sidebar.statistics",
  //     href: "/statistics",
  //   },
  //   {
  //     icon: "notice",
  //     name: "trans.sidebar.notice",
  //     href: "/notice",
  //   },
  // ];

  const options = ND.Nam_Dinh.districts.map((item) => {
    return {
      value: item.id,
      label: (
        <div
          className="flex items-center justify-start gap-1"
          onClick={() => {
            setSelect(item.id);
          }}
        >
          <div className="col-span-2">{item.name}</div>
        </div>
      ),
    };
  });



  useEffect(()=> {
    onChange(select, field);
  }, [select, field])

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="grid gap-4 px-4">
        <div className="py-6 flex justify-center">
          <SideBarLogo collapsed={collapsed} />
        </div>
        <div>
          <Select
            size="large"
            style={{ width: "100%" }}
            defaultValue={"Nam Định"}
            options={options}
          />
        </div>
        <Menu style={{ border: "none" }} className="grid gap-1">
          {TopMenuItems.map((item: any) => {
            return (
              <Menu.Item
                key={item.name}
                style={{
                  padding: 0,
                  margin: 0,
                  width: "100%",
                  height: "auto",
                  background: "transparent",
                }}
              >
                <MenuSideBarItem
                  name={item.name}
                  href={item.href ?? ""}
                  icon={item.icon}
                  collapsed={collapsed}
                  active={item.id === field}
                  badge={item.notification}
                  onClick={item.onClick}
                />
              </Menu.Item>
            );
          })}
        </Menu>
      </div>

      {!collapsed && (
        <div className="grid gap-2 mt-auto px-4 w-full">
          <h2 className="px-3 mb-2 text-base font-bold">
            {"trans.sidebar.language"}
          </h2>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
