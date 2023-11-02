import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/ui/card';
import { Award, Medal, Trophy } from 'lucide-react';
import React from 'react';

const TopRankingsPodium = (props: any) => {
  const { leaderboard } = props;
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-lg p-1">
      <div className="flex gap-3">
        <div className="mx-4 flex flex-col items-center justify-center">
          <Card className="mb-4 mt-6 flex w-48 flex-col justify-center bg-white">
            <CardHeader>
              <CardTitle className="text-center text-blue-500">
                2nd Place
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Badge variant="secondary">
                <Avatar className="mx-auto">
                  <AvatarImage
                    src={leaderboard[1].avatar}
                    alt={leaderboard[1].issuer}
                    className="h-16 w-16"
                  />
                  <AvatarFallback>QSTN</AvatarFallback>
                </Avatar>
              </Badge>
              <div className="mt-4 flex flex-col flex-nowrap items-center justify-center text-center">
                <Award
                  className="mb-2 text-lg text-blue-500"
                  aria-label="2nd Place"
                />
                <CardDescription className="max-w-[128px] overflow-hidden truncate text-center text-xs">
                  <span>{leaderboard[1].issuer}</span>
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mx-4 flex flex-col items-center justify-center">
          <Card className="-mt-12 flex w-64 flex-col justify-center bg-white">
            <CardHeader>
              <CardTitle className="text-center text-green-500">
                1st Place
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Badge variant="default">
                <Avatar className="mx-auto">
                  <AvatarImage
                    src={leaderboard[0].avatar}
                    alt={leaderboard[0].issuer}
                    className="h-16 w-16"
                  />
                  <AvatarFallback>QSTN</AvatarFallback>
                </Avatar>
              </Badge>
              <div className="mt-4 flex flex-col flex-nowrap items-center justify-center text-center">
                <Trophy
                  className="mb-2 text-center text-lg text-yellow-500"
                  aria-label="1st Place"
                />
                <CardDescription className="max-w-[128px] overflow-hidden truncate text-center text-xs">
                  <span>{leaderboard[0].issuer}</span>
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mx-4 flex flex-col items-center justify-center">
          <Card className="mb-4 mt-6 flex w-48 flex-col justify-center bg-white">
            <CardHeader>
              <CardTitle className="text-center text-red-500">
                3rd Place
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Badge variant="destructive">
                <Avatar className="mx-auto">
                  <AvatarImage
                    src={leaderboard[2].avatar}
                    alt={leaderboard[2].issuer}
                    className="h-16 w-16"
                  />
                  <AvatarFallback>QSTN</AvatarFallback>
                </Avatar>
              </Badge>
              <div className="mt-4 flex flex-col flex-nowrap items-center justify-center text-center">
                <Medal
                  className="mb-2 text-lg text-red-500"
                  aria-label="3rd Place"
                />
                <CardDescription className="max-w-[128px] overflow-hidden truncate text-center text-xs">
                  <span>{leaderboard[2].issuer}</span>
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TopRankingsPodium;
