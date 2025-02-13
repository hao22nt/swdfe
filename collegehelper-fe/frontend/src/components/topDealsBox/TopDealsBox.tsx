
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { topDealUsers } from './data';
//import { fetchTopDeals } from '../../api/ApiCollection';
interface TopDealsUser {
  id: number;
  img: string;
  name: string;
  email: string;
}

const TopDealsBox = () => {
  const tempTotalEntries = [1, 2, 3, 4, 5, 6, 7];

  const { isLoading, isSuccess, data } = useQuery<TopDealsUser[]>({
    queryKey: ['topdeals'],
    queryFn: () => Promise.resolve(topDealUsers), // return vitual data
  });

  return (
    <div className="w-full p-0 m-0 flex flex-col items-stretch gap-6 xl:gap-4 2xl:gap-9">
      <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
        Top Universities
      </span>
      <div className="w-full flex flex-col items-stretch gap-3">
        {isLoading &&
          tempTotalEntries.map((_item, index) => (
            <div
              key={index}
              className="w-full flex justify-between items-center h-auto px-1 py-2"
            >
              <div className="flex gap-3 2xl:gap-4 items-center">
                <div className="skeleton w-10 h-10 xl:w-8 xl:h-8 2xl:w-16 2xl:h-16 rounded-full"></div>
                <div className="flex flex-col items-start gap-1">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              </div>
            </div>
          ))}
        {isSuccess &&
          data.map((university, index) => (
            <button
              onClick={() => toast(`Trường ${university.name}`, { icon: '🏫' })}
              key={index}
              className="w-full flex justify-between items-center h-auto btn btn-ghost px-1 py-2"
            >
              <div className="flex gap-3 2xl:gap-4 items-center">
                <div className="avatar">
                  <div className="w-11 xl:w-8 2xl:w-16 3xl:w-20 rounded-full">
                    <img src={university.img} alt={`university-${index}`} />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm xl:text-[13px] 2xl:text-lg 3xl:text-xl m-0 p-0">
                    {university.name}
                  </span>
                  <span className="text-xs xl:text-[10px] 2xl:text-sm 3xl:text-base">
                    {university.email}
                  </span>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default TopDealsBox;
