
import TopDealsBox from '../../components/topDealsBox/TopDealsBox';
import ChartBox from '../../components/charts/ChartBox';
import { useQuery } from '@tanstack/react-query';
import { MdGroup, MdInventory2, MdLogin } from 'react-icons/md'; // Thêm MdLogin
import {
  fetchTotalUniversities,
  fetchTotalProfit,
  fetchTotalSource,
  fetchTotalUsers,
  fetchUserLoginStats, // Thay fetchTotalVisit
} from '../../api/ApiCollection';

const Home = () => {
  const queryGetTotalUsers = useQuery({
    queryKey: ['totalusers'],
    queryFn: fetchTotalUsers,
  });

  const queryGetTotalUniversities = useQuery({
    queryKey: ['totaluniversities'],
    queryFn: fetchTotalUniversities,
  });

  const queryGetTotalSource = useQuery({
    queryKey: ['totalsource'],
    queryFn: fetchTotalSource,
  });

  const queryGetUserLoginStats = useQuery({
    queryKey: ['userloginstats'],
    queryFn: fetchUserLoginStats,
  });

  const queryGetTotalProfit = useQuery({
    queryKey: ['totalprofit'],
    queryFn: fetchTotalProfit,
  });

  return (
    <div className="home w-full p-0 m-0">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-flow-dense auto-rows-[minmax(200px,auto)] xl:auto-rows-[minmax(150px,auto)] gap-3 xl:gap-3 px-0">
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 row-span-3 3xl:row-span-5">
          <TopDealsBox />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdGroup}
            title="Total Users"
            dataKey="value"
            number={queryGetTotalUsers.data?.number}
            chartData={queryGetTotalUsers.data?.chartData}
            isLoading={queryGetTotalUsers.isLoading}
            isSuccess={queryGetTotalUsers.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdInventory2}
            title="Total Products" // UI sẽ đổi thành "Total University" trong ChartBox
            dataKey="value"
            number={queryGetTotalUniversities.data?.number}
            chartData={queryGetTotalUniversities.data?.chartData}
            isLoading={queryGetTotalUniversities.isLoading}
            isSuccess={queryGetTotalUniversities.isSuccess}
          />
        </div>
        <div className="box row-span-3 col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-5">
          <ChartBox
            chartType={'pie'}
            title="Leads by Source"
            {...queryGetTotalSource.data}
            isLoading={queryGetTotalSource.isLoading}
            isSuccess={queryGetTotalSource.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'bar'}
            title="User Login Stats" // Thay "Total Visit"
            dataKey="value"
            number={queryGetUserLoginStats.data?.number}
            chartData={queryGetUserLoginStats.data?.chartData}
            IconBox={MdLogin} // Thêm icon mới
            isLoading={queryGetUserLoginStats.isLoading}
            isSuccess={queryGetUserLoginStats.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'bar'}
            title="Total Profit"
            {...queryGetTotalProfit.data}
            isLoading={queryGetTotalProfit.isLoading}
            isSuccess={queryGetTotalProfit.isSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;