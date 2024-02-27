"use client";
import { Menu, Select } from "antd";
import { useEffect, useState } from "react";
import ND from "../../ND.json";
import Category from "../../category.json";
import MenuSideBarItem from "../MenuSideBarItem";
type IG = {
  collapsed?: boolean;
  onChangeND?: (item: string) => void;
  onChangeCategory?: (item: string) => void;
  category?: string;
};

const SidebarMenu = ({
  collapsed = false,
  onChangeND,
  onChangeCategory,
  category,
}: IG) => {
  const [field, setField] = useState<string>();
  const [select, setSelect] = useState<string>("");
  const TopMenuItems: any[] = Category.data.map((item) => {
    return {
      name: item.name,
      id: item.id,
      onClick: () => {
        setField(item.id);
      },
      href: `/category/${item.id}`
    };
  });

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
  const [openSelect, setOpenSelect] = useState<boolean>(true);

  useEffect(() => {
    if (onChangeND) onChangeND(select);
  }, [select]);

  useEffect(() => {
    if (onChangeCategory) onChangeCategory(field || "");
  }, [field]);

  useEffect(() => {
    if (category) setField(category);
  }, [category]);

  return (
    <div className="flex flex-col justify-between h-full bg-white">
      <div className="grid gap-4 px-4">
        {category ? (
          <div>
            <Select
              size="large"
              style={{ width: "100%" }}
              defaultValue={'Mời Lựa chọn'}
              value={null}
              options={options}
              open={openSelect}
              onClick={() => setOpenSelect(!openSelect)}
            />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
