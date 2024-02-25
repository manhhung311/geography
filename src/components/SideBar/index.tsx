import { Layout } from 'antd';
import SidebarMenu from '../SidebarMenu';

type IG = {
  collapsed?: boolean;
  onChangeND?: (item: string) => void;
  onChangeCategory?: (item: string) => void;
  category?: string;
};

const SideBar = ({ collapsed = false, onChangeND, onChangeCategory, category }: IG) => {
  return (
    <Layout
      className="hidden border-r border-gray lg:block z-[10]"
      style={{
        height: '100vh',
        left: 0,
      }}
    >
      <SidebarMenu collapsed={collapsed} onChangeND={onChangeND} onChangeCategory={onChangeCategory} category={category}/>
    </Layout>
  );
};

export default SideBar;
