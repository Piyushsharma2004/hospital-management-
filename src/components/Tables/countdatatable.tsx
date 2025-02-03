'use client';
import { useState, useEffect, useCallback } from 'react';
import { Download, Building } from 'lucide-react';

type PeriodData = {
  count: number;
  key: string;
};

type RoomData = {
  roomId: string;
  periods: PeriodData[];
};

const TimeTableComponent = () => {
  const [selectedBlock, setSelectedBlock] = useState('VIB');
  const [periodData, setPeriodData] = useState<PeriodData[][]>([]);

  const timeSlots = [
    "8:00 - 8:50", "8:50 - 9:40", "9:40 - 10:30", "10:50 - 11:40", "11:40 - 12:30", "12:30 - 1:00",
    "1:00 - 1:50", "1:50 - 2:40", "2:40 - 3:30", "3:50 - 4:40", "4:40 - 5:30", "5:30 - 6:00"
  ];

  const blocks = ['VIB', 'NYB', 'KAB', 'NIB'];

  // Function to generate weighted count
  const generateWeightedCount = useCallback(() => {
    const isLowRange = Math.random() < 0.5;
    return isLowRange
      ? Math.floor(Math.random() * 5) + 1
      : Math.floor(Math.random() * 66) + 5;
  }, []);

  // Initialize period data
  useEffect(() => {
    const initializeData = () => {
      const newData = [...Array(13)].map((_, roomIndex) =>
        [...Array(12)].map((_, periodIndex) => ({
          count: generateWeightedCount(),
          key: `${roomIndex}-${periodIndex}-${Date.now()}`
        }))
      );
      setPeriodData(newData);
    };

    initializeData();
  }, [generateWeightedCount]);

  // Update counts every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPeriodData(prevData =>
        prevData.map(room =>
          room.map(period => ({
            ...period,
            count: generateWeightedCount(),
            key: `${period.key.split('-')[0]}-${period.key.split('-')[1]}-${Date.now()}`
          }))
        )
      );
    }, 20000);

    return () => clearInterval(intervalId);
  }, [generateWeightedCount]);

  // Function to get style classes based on occupancy
  const getOccupancyStyle = (count: number) => {

    if (count <= 5) return {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-500 dark:border-green-600'
    };
    return {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-500 dark:border-red-600'
    };
  };

  // Download table data as CSV
  const downloadCSV = () => {
    const csv = `Room,${timeSlots.join(',')}\n` +
      periodData.map((room, roomIndex) =>
        `${selectedBlock}-${(roomIndex + 1).toString().padStart(2, '0')}1,${room.map(period => period.count).join(',')}`
      ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedBlock}-occupancy-data.csv`;
    a.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white dark:bg-gray-900 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {blocks.map((block) => (
            <button
              key={block}
              onClick={() => setSelectedBlock(block)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${selectedBlock === block 
                  ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {block}
              </span>
            </button>
          ))}
        </div>
        
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border dark:border-gray-700 shadow-lg">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 text-gray-700 dark:text-gray-300">
                Room
              </th>
              {timeSlots.map((time, index) => (
                <th 
                  key={time}
                  className={`border dark:border-gray-700 p-3 min-w-[100px] text-xs
                    ${index < 6 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-cyan-50 dark:bg-cyan-900/30'}
                    ${index === 5 ? 'border-r-2 border-r-gray-400 dark:border-r-gray-600' : ''}
                    text-gray-700 dark:text-gray-300`}
                >
                  <div className="font-bold mb-1">{`P${index + 1}`}</div>
                  <div className="text-xs opacity-75">{time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periodData.map((roomPeriods, roomIndex) => (
              <tr key={roomIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="border dark:border-gray-700 p-3 font-medium sticky left-0 bg-white dark:bg-gray-800 z-10 text-gray-700 dark:text-gray-300">
                  {`${selectedBlock}-${(roomIndex + 1).toString().padStart(2, '0')}1`}
                </td>
                {roomPeriods.map((period, periodIndex) => {
                  const style = getOccupancyStyle(period.count);
                  return (
                    <td
                      key={period.key}
                      className={`border-2 p-3 text-center transition-colors
                        ${periodIndex === 5 ? 'border-r-2 border-r-gray-400 dark:border-r-gray-600 bg-gray-100 dark:bg-gray-900' : ''}
                        ${style.bg} ${style.text} ${style.border}`}
                    >
                      {periodIndex !== 5 && (
                        <div className="font-bold">{period.count}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/20"></div>
          <span className="text-gray-600 dark:text-gray-400">Low Occupancy (≤ 5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-red-500 bg-orange-50 dark:bg-orange-900/20"></div>
          <span className="text-gray-600 dark:text-gray-400">High Occupancy ({'>'} 5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Break Time</span>
        </div>
      </div>
    </div>
  );
};

export default TimeTableComponent;