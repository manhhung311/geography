import { Layout } from 'antd';
import SidebarMenu from '../SidebarMenu';

type IG = {
  collapsed?: boolean;
  onChange:(select: string, field: string)=> void
};

const SideBar = ({ collapsed = false, onChange }: IG) => {
  return (
    <Layout
      className="hidden h-screen border-r border-gray lg:block z-[10]"
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <SidebarMenu collapsed={collapsed} onChange={onChange}/>
    </Layout>
  );
};

export default SideBar;
