import useInterval from '@components/Hooks/useInterval';
import {
  CheckIcon,
  HandThumbUpIcon,
  PhotoIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState } from 'react';

const timeline = [
  {
    id: 1,
    content: 'New user sign-up - ',
    target: 'User ID #396',
    href: '#',
    date: 'Sep 20',
    datetime: '2020-09-20',
    icon: UserIcon,
    iconBackground: 'bg-gray-400'
  },
  {
    id: 2,
    content: 'NFT Reward minted by',
    target: 'User ID #12',
    href: '#',
    date: 'Sep 22',
    datetime: '2020-09-22',
    icon: PhotoIcon,
    iconBackground: 'bg-indigo-500'
  },
  {
    id: 3,
    content: 'Survey Completed by',
    target: 'User ID #263',
    href: '#',
    date: 'Sep 28',
    datetime: '2020-09-28',
    icon: CheckIcon,
    iconBackground: 'bg-green-500'
  },
  {
    id: 4,
    content: 'Reward claimed by',
    target: 'User ID #92',
    href: '#',
    date: 'Sep 30',
    datetime: '2020-09-30',
    icon: HandThumbUpIcon,
    iconBackground: 'bg-blue-500'
  },
  {
    id: 5,
    content: 'Survey Completed by',
    target: 'User ID #111',
    href: '#',
    date: 'Oct 4',
    datetime: '2020-10-04',
    icon: CheckIcon,
    iconBackground: 'bg-green-500'
  },
  {
    id: 6,
    content: 'New user sign-up - ',
    target: 'User ID #396',
    href: '#',
    date: 'Sep 20',
    datetime: '2020-09-20',
    icon: UserIcon,
    iconBackground: 'bg-gray-400'
  },
  {
    id: 7,
    content: 'NFT Reward minted by',
    target: 'User ID #12',
    href: '#',
    date: 'Sep 22',
    datetime: '2020-09-22',
    icon: PhotoIcon,
    iconBackground: 'bg-indigo-500'
  },
  {
    id: 8,
    content: 'Survey Completed by',
    target: 'User ID #263',
    href: '#',
    date: 'Sep 28',
    datetime: '2020-09-28',
    icon: CheckIcon,
    iconBackground: 'bg-green-500'
  },
  {
    id: 9,
    content: 'Reward claimed by',
    target: 'User ID #92',
    href: '#',
    date: 'Sep 30',
    datetime: '2020-09-30',
    icon: HandThumbUpIcon,
    iconBackground: 'bg-blue-500'
  },
  {
    id: 10,
    content: 'Survey Completed by',
    target: 'User ID #111',
    href: '#',
    date: 'Oct 4',
    datetime: '2020-10-04',
    icon: CheckIcon,
    iconBackground: 'bg-green-500'
  },
  {
    id: 11,
    content: 'Survey Completed by',
    target: 'User ID #263',
    href: '#',
    date: 'Sep 28',
    datetime: '2020-09-28',
    icon: CheckIcon,
    iconBackground: 'bg-green-500'
  },
  {
    id: 12,
    content: 'Reward claimed by',
    target: 'User ID #92',
    href: '#',
    date: 'Sep 30',
    datetime: '2020-09-30',
    icon: HandThumbUpIcon,
    iconBackground: 'bg-blue-500'
  },
  {
    id: 13,
    content: 'Survey Completed by',
    target: 'User ID #111',
    href: '#',
    date: 'Oct 4',
    datetime: '2020-10-04',
    icon: CheckIcon,
    iconBackground: 'bg-green-500'
  },
  {
    id: 14,
    content: 'Reward received by',
    target: 'User ID #133',
    href: '#',
    date: 'Oct 6',
    datetime: '2020-10-06',
    icon: SparklesIcon,
    iconBackground: 'bg-yellow-500'
  }
];

// Function to generate random dates
function randomDate(start: any, end: any) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Function to randomize "target" and "dates"
function randomizeTimelineData(originalTimeline: any, itemCount: any) {
  const randomizedTimeline = [];
  const targetOptions = [
    'User ID #1',
    'User ID #2',
    'User ID #3',
    'User ID #4',
    'User ID #5',
    'User ID #6',
    'User ID #7',
    'User ID #8',
    'User ID #9',
    'User ID #10',
    'User ID #11'
  ]; // Add more if needed

  for (let i = 0; i < itemCount; i++) {
    const randomIndex = Math.floor(Math.random() * originalTimeline.length);
    const randomDate1 = randomDate(new Date(2020, 0, 1), new Date());
    const randomDate2 = new Date(randomDate1);
    randomDate2.setDate(randomDate2.getDate() + 1 + (i % 7));

    const randomTarget =
      targetOptions[Math.floor(Math.random() * targetOptions.length)];

    const newItem = {
      ...originalTimeline[randomIndex],
      id: i + 1,
      target: randomTarget,
      date: randomDate1.toDateString().slice(4), // Format date like 'Sep 20'
      datetime: randomDate1.toISOString().slice(0, 10)
    };

    randomizedTimeline.push(newItem);

    // Uncomment this to add a duplicate entry on every 7th day
    // if ((i + 1) % 7 === 0) {
    //   const duplicateItem = {
    //     ...newItem,
    //     id: i + 1 + itemCount,
    //     datetime: randomDate2.toISOString().slice(0, 10),
    //   };
    //   randomizedTimeline.push(duplicateItem);
    // }
  }

  return randomizedTimeline;
}

export default function ActivityFeed(props: any) {
  const [events, setEvents] = useState<any>([]);

  const onSystemEvent = () => {
    const id = Math.round(Math.random() * 10000);
    // Randomize the timeline and extend it to 100 items
    const randomizedTimeline = randomizeTimelineData(timeline, 1000);
    const eventNow =
      randomizedTimeline[Math.round(Math.random() * (1 + 1000) + 1) + 1];

    if (eventNow !== undefined) {
      console.log(eventNow);
      setEvents([eventNow, ...events]);
    }
  };

  useInterval(
    () => {
      onSystemEvent();
    },
    (Math.round(Math.random() * (6 + 33) + 1) + 6) * 1000
  );

  return (
    <div className="flow-root">
      <div className="overflow-hidden shadow sm:rounded-md">
        <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
          <div>
            <p className="font-segoe-ui mb-1 text-3xl font-bold tracking-tight">
              Activity Feed
            </p>
            <p className="text-sm text-[#777E91]">Real-time activities feed</p>
          </div>
          <ul role="list" className="mt-6">
            {events?.length &&
              events.map((event: any, eventIdx: number) => (
                <li
                  key={`${event.id}-${eventIdx}`}
                  className={clsx('text-xs', eventIdx === 0 ? 'fadeIn' : null)}
                >
                  <div className="relative pb-8">
                    {eventIdx !== timeline.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={clsx(
                            event.iconBackground,
                            'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                          )}
                        >
                          <event.icon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-xs text-gray-500">
                            {event.content}{' '}
                            <a
                              href={event.href}
                              className="font-medium text-gray-900"
                            >
                              {event.target}
                            </a>
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-gray-500">
                          <time dateTime={event.datetime}>{event.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
