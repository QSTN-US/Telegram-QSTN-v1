import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { Trophy } from 'lucide-react';
import React from 'react';

const GamifiedLeaderboard = (props: any) => {
  const { leaderboard } = props;
  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold dark:text-white">
        QSTN Global Leaderboard
      </h2>
      <Table>
        <TableCaption className="dark:text-gray-200">
          The ranked leaderboard based on scores achieved in quizzes / surveys.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead>DID (decentralized identity)</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell className="flex dark:text-green-300">
                {entry.rank}
                {entry.rank === 1 ? (
                  <Trophy
                    className="ml-3 text-lg text-yellow-500"
                    aria-label="1st Place"
                  />
                ) : null}
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={entry.avatar} alt={entry.issuer} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium dark:text-gray-200">
                {entry.issuer}
              </TableCell>
              <TableCell className="text-right dark:text-green-300">
                <Trophy className="inline-flex h-4 w-4" /> {entry.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GamifiedLeaderboard;
