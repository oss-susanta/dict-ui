import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Typography } from 'antd';
import { Link, Redirect, Route, Switch, useLocation } from 'wouter';
import ReactApp from './components/ReactApp';
import ReactQueryApp from './components/ReactQueryApp';
import ReduxApp from './components/ReduxApp';
import ReduxToolkitApp from './components/ReduxToolkitApp';

const apps = [
  {
    value: '/react',
    label: 'React',
    Component: ReactApp,
  },
  {
    value: '/redux',
    label: 'Redux',
    Component: ReduxApp,
  },
  {
    value: '/redux-toolkit',
    label: 'Redux Toolkit',
    Component: ReduxToolkitApp,
  },
  {
    value: '/react-query',
    label: 'React Query',
    Component: ReactQueryApp,
  },
];

export default function App() {
  const [current] = useLocation();
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Text style={{ fontSize: 20, color: '#fff' }}>
          Dictionary App
        </Typography.Text>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          style={{ minWidth: 400 }}
        >
          {apps.map((menu) => (
            <Menu.Item key={menu.value}>
              <Link href={menu.value}>{menu.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Header>
      <Layout.Content style={{ flex: 1 }}>
        <Switch>
          {apps.map((menu) => (
            <Route
              key={menu.value}
              path={menu.value}
              component={menu.Component}
            />
          ))}
          <Route>
            <Redirect to="/react" />
          </Route>
        </Switch>
      </Layout.Content>
    </Layout>
  );
}
