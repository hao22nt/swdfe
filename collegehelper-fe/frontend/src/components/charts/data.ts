import {
  MdGroup,
  MdInventory2,
} from 'react-icons/md';

export const totalUsers = {
  color: '#8884d8',
  IconBox: MdGroup,
  title: 'Total Users',
  number: '11',
  dataKey: 'users',
  percentage: 45,
  chartData: [
    { name: 'Sun', users: 400 },
    { name: 'Mon', users: 600 },
    { name: 'Tue', users: 500 },
    { name: 'Wed', users: 700 },
    { name: 'Thu', users: 400 },
    { name: 'Fri', users: 500 },
    { name: 'Sat', users: 450 },
  ],
};

export const AcceptedApplications = {
  color: 'skyblue',
  IconBox: MdInventory2,
  title: 'Total University',  
  number: '238',
  dataKey: 'Applications',
  percentage: 21,
  chartData: [
    { name: 'Sun', products: 400 },
    { name: 'Mon', products: 600 },
    { name: 'Tue', products: 500 },
    { name: 'Wed', products: 700 },
    { name: 'Thu', products: 400 },
    { name: 'Fri', products: 500 },
    { name: 'Sat', products: 450 },
  ],
};



export const totalVisit = {
  title: 'Total Visit',
  color: '#FF8042',
  dataKey: 'visit',
  chartData: [
    {
      name: 'Sun',
      visit: 4000,
    },
    {
      name: 'Mon',
      visit: 3000,
    },
    {
      name: 'Tue',
      visit: 2000,
    },
    {
      name: 'Wed',
      visit: 2780,
    },
    {
      name: 'Thu',
      visit: 1890,
    },
    {
      name: 'Fri',
      visit: 2390,
    },
    {
      name: 'Sat',
      visit: 3490,
    },
  ],
};

export const totalProfit = {
  title: 'Profit Earned',
  color: '#8884d8',
  dataKey: 'profit',
  chartData: [
    {
      name: 'Sun',
      profit: 4000,
    },
    {
      name: 'Mon',
      profit: 3000,
    },
    {
      name: 'Tue',
      profit: 2000,
    },
    {
      name: 'Wed',
      profit: 2780,
    },
    {
      name: 'Thu',
      profit: 1890,
    },
    {
      name: 'Fri',
      profit: 2390,
    },
    {
      name: 'Sat',
      profit: 3490,
    },
  ],
};

export const totalSource = {
  title: 'Popular Fields of Study',
  dataKey: 'value',
  chartPieData: [
    { name: 'IT', value: 350, color: '#0088FE' },
    { name: 'Pharmacy', value: 250, color: '#00C49F' },
    { name: 'Business', value: 325, color: '#FFBB28' },
    { name: 'Other', value: 75, color: '#FF8042' },
  ],
};

