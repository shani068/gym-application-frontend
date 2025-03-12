import React from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";
import { useAuth } from '@/contexts/auth-context';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Link rel="noopener noreferrer" href="/profile">
        Profile
      </Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link rel="noopener noreferrer" href="https://www.aliyun.com">
        Logout
      </Link>
    ),
  },
];

// console.log("decoded token ", decoded)
const DropDown: React.FC = () => {
  const { token } = useAuth();
  let username = '';
  if (token) {
    const decoded: { username: string } = jwtDecode(token);
    username = decoded.username;
  }
  return (
    <Space direction = "vertical" >
    <Space wrap>
      <Dropdown menu={{ items }} placement="bottom">
        <Button className='capitalize'>Hi, {username}</Button>
      </Dropdown>
    </Space>
  </Space>
  )
};

export default DropDown;