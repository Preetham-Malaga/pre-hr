import type { User } from '../types';

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=4f63f3&fontFamily=Helvetica`;

export const seedUsers: User[] = [
  { id: '1',  name: 'Arjun Mehta',      email: 'arjun.mehta@corp.io',     role: 'Admin',    department: 'Engineering',   status: 'Active',   avatar: avatarUrl('AM'), joinDate: '2021-03-12', phone: '+91 98765 43210' },
  { id: '2',  name: 'Priya Sharma',     email: 'priya.sharma@corp.io',    role: 'HR',       department: 'Human Resources',status: 'Active',  avatar: avatarUrl('PS'), joinDate: '2020-07-01', phone: '+91 87654 32109' },
  { id: '3',  name: 'Rahul Nair',       email: 'rahul.nair@corp.io',      role: 'Manager',  department: 'Product',        status: 'Active',   avatar: avatarUrl('RN'), joinDate: '2019-11-25', phone: '+91 76543 21098' },
  { id: '4',  name: 'Sneha Reddy',      email: 'sneha.reddy@corp.io',     role: 'Employee', department: 'Design',         status: 'Active',   avatar: avatarUrl('SR'), joinDate: '2022-01-15', phone: '+91 65432 10987' },
  { id: '5',  name: 'Vikram Singh',     email: 'vikram.singh@corp.io',    role: 'Employee', department: 'Engineering',    status: 'On Leave', avatar: avatarUrl('VS'), joinDate: '2021-08-09', phone: '+91 54321 09876' },
  { id: '6',  name: 'Anjali Patel',     email: 'anjali.patel@corp.io',    role: 'HR',       department: 'Human Resources',status: 'Active',  avatar: avatarUrl('AP'), joinDate: '2022-04-20', phone: '+91 43210 98765' },
  { id: '7',  name: 'Karan Verma',      email: 'karan.verma@corp.io',     role: 'Manager',  department: 'Sales',          status: 'Active',   avatar: avatarUrl('KV'), joinDate: '2020-02-14', phone: '+91 32109 87654' },
  { id: '8',  name: 'Divya Krishnan',   email: 'divya.k@corp.io',         role: 'Employee', department: 'Marketing',      status: 'Inactive', avatar: avatarUrl('DK'), joinDate: '2023-06-30', phone: '+91 21098 76543' },
  { id: '9',  name: 'Rohan Gupta',      email: 'rohan.gupta@corp.io',     role: 'Employee', department: 'Engineering',    status: 'Active',   avatar: avatarUrl('RG'), joinDate: '2022-09-05', phone: '+91 10987 65432' },
  { id: '10', name: 'Meera Iyer',       email: 'meera.iyer@corp.io',      role: 'Employee', department: 'Finance',        status: 'Active',   avatar: avatarUrl('MI'), joinDate: '2021-12-01', phone: '+91 09876 54321' },
  { id: '11', name: 'Aditya Kumar',     email: 'aditya.kumar@corp.io',    role: 'Manager',  department: 'Engineering',    status: 'Active',   avatar: avatarUrl('AK'), joinDate: '2019-05-22', phone: '+91 98760 12345' },
  { id: '12', name: 'Nisha Bose',       email: 'nisha.bose@corp.io',      role: 'Employee', department: 'Design',         status: 'On Leave', avatar: avatarUrl('NB'), joinDate: '2023-01-10', phone: '+91 87651 23456' },
];
