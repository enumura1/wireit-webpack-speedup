import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESModuleでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// コンポーネントのディレクトリを確保
const componentsDir = path.join(__dirname, '../src/components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// 共通コンポーネントを生成
const commonComponents = [
  {
    name: 'Header',
    content: `import React from 'react';
import { UserProfile } from './UserProfile';
import { NotificationBell } from './NotificationBell';
import { SearchBar } from './SearchBar';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-600">Wireit Demo App</h1>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell count={5} />
          <UserProfile name="John Doe" avatar="/avatar.jpg" />
        </div>
      </div>
    </header>
  );
};

export default Header;
`
  },
  {
    name: 'Sidebar',
    content: `import React from 'react';
import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-full">
      <div className="p-4">
        <SidebarSection title="Main">
          <SidebarItem icon="dashboard" label="Dashboard" active />
          <SidebarItem icon="chart" label="Analytics" />
          <SidebarItem icon="calendar" label="Calendar" />
          <SidebarItem icon="email" label="Messages" />
        </SidebarSection>
        
        <SidebarSection title="Projects">
          <SidebarItem icon="folder" label="Frontend" />
          <SidebarItem icon="folder" label="Backend" />
          <SidebarItem icon="folder" label="Mobile" />
        </SidebarSection>
        
        <SidebarSection title="Settings">
          <SidebarItem icon="settings" label="Preferences" />
          <SidebarItem icon="user" label="Profile" />
          <SidebarItem icon="help" label="Help" />
        </SidebarSection>
      </div>
    </aside>
  );
};

export default Sidebar;
`
  },
  {
    name: 'Dashboard',
    content: `import React from 'react';
import { Card } from './Card';
import { Chart } from './Chart';
import { Table } from './Table';
import { StatCard } from './StatCard';

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Users" value="1,234" change="+12%" />
        <StatCard title="Revenue" value="$12,345" change="+8%" />
        <StatCard title="Conversion" value="12.3%" change="-2%" />
        <StatCard title="Sessions" value="5,678" change="+24%" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Revenue Over Time">
          <Chart type="line" />
        </Card>
        <Card title="Sales by Category">
          <Chart type="pie" />
        </Card>
      </div>
      
      <Card title="Recent Transactions">
        <Table />
      </Card>
    </main>
  );
};

export default Dashboard;
`
  },
  {
    name: 'Footer',
    content: `import React from 'react';
import { FooterLink } from './FooterLink';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; 2025 Wireit Demo App. All Rights Reserved.</p>
        </div>
        <div className="flex space-x-4">
          <FooterLink label="Privacy" url="#" />
          <FooterLink label="Terms" url="#" />
          <FooterLink label="Contact" url="#" />
          <FooterLink label="About" url="#" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`
  }
];

// 共通コンポーネントを書き込み
commonComponents.forEach(component => {
  fs.writeFileSync(
    path.join(componentsDir, `${component.name}.tsx`),
    component.content
  );
});

// 小さなコンポーネントを生成
const smallComponents = [
  {
    name: 'UserProfile',
    content: `import React from 'react';

interface UserProfileProps {
  name: string;
  avatar: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, avatar }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};
`
  },
  {
    name: 'NotificationBell',
    content: `import React from 'react';

interface NotificationBellProps {
  count: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
  return (
    <div className="relative">
      <button className="p-1">
        <span className="text-gray-600">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>
    </div>
  );
};
`
  },
  {
    name: 'SearchBar',
    content: `import React from 'react';

export const SearchBar: React.FC = () => {
  return (
    <div className="ml-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-100 rounded-lg py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
    </div>
  );
};
`
  },
  {
    name: 'SidebarSection',
    content: `import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">{title}</h3>
      <ul className="space-y-1">
        {children}
      </ul>
    </div>
  );
};
`
  },
  {
    name: 'SidebarItem',
    content: `import React from 'react';

interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active }) => {
  return (
    <li>
      <a
        href="#"
        className={\`flex items-center py-2 px-4 rounded-lg \${
          active ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
        }\`}
      >
        <span className="mr-3">
          {icon === 'dashboard' && '📊'}
          {icon === 'chart' && '📈'}
          {icon === 'calendar' && '📅'}
          {icon === 'email' && '✉️'}
          {icon === 'folder' && '📁'}
          {icon === 'settings' && '⚙️'}
          {icon === 'user' && '👤'}
          {icon === 'help' && '❓'}
        </span>
        <span>{label}</span>
      </a>
    </li>
  );
};
`
  },
  {
    name: 'Card',
    content: `import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
`
  },
  {
    name: 'Chart',
    content: `import React from 'react';

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
}

export const Chart: React.FC<ChartProps> = ({ type }) => {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
      <p className="text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)} Chart Placeholder</p>
    </div>
  );
};
`
  },
  {
    name: 'Table',
    content: `import React from 'react';

export const Table: React.FC = () => {
  const data = [
    { id: 1, date: '2025-04-10', customer: 'Jane Smith', amount: '$230.00', status: 'Completed' },
    { id: 2, date: '2025-04-09', customer: 'John Doe', amount: '$125.50', status: 'Pending' },
    { id: 3, date: '2025-04-08', customer: 'Alice Johnson', amount: '$540.00', status: 'Completed' },
    { id: 4, date: '2025-04-07', customer: 'Bob Brown', amount: '$92.25', status: 'Failed' },
    { id: 5, date: '2025-04-06', customer: 'Carol White', amount: '$305.75', status: 'Completed' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{row.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                  row.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : row.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }\`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
`
  },
  {
    name: 'StatCard',
    content: `import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex items-baseline justify-between mt-1">
        <p className="text-2xl font-semibold">{value}</p>
        <p className={\`text-sm \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
          {change}
        </p>
      </div>
    </div>
  );
};
`
  },
  {
    name: 'FooterLink',
    content: `import React from 'react';

interface FooterLinkProps {
  label: string;
  url: string;
}

export const FooterLink: React.FC<FooterLinkProps> = ({ label, url }) => {
  return (
    <a href={url} className="hover:text-white transition-colors">
      {label}
    </a>
  );
};
`
  }
];

// 小さなコンポーネントを書き込み
smallComponents.forEach(component => {
  fs.writeFileSync(
    path.join(componentsDir, `${component.name}.tsx`),
    component.content
  );
});

// 追加の小さなコンポーネントを大量に生成
for (let i = 1; i <= 80; i++) {
  const componentName = `ExampleComponent${i}`;
  
  const content = `import React from 'react';

interface ${componentName}Props {
  title?: string;
  description?: string;
  number?: number;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ title = 'Default Title', description = 'Default description for this component.', number = ${i} }) => {
  return (
    <div className="border p-4 rounded-lg my-2">
      <h3 className="text-lg font-medium">{title} #{number}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-2">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Action {number}
        </button>
      </div>
    </div>
  );
};
`;

  fs.writeFileSync(
    path.join(componentsDir, `${componentName}.tsx`),
    content
  );
}

console.log('Generated components successfully!');
