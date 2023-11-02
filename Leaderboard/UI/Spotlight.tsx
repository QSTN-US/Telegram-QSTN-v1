import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@components/ui/card';
import { Badge as BadgeIcon, Medal, StarHalf } from 'lucide-react';
import React from 'react';

export default function TopPerformerSpotlight() {
  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white shadow-lg">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">
              Top Performer Spotlight
            </CardTitle>
            <BadgeIcon className="h-5 w-5 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-start p-4">
          <Avatar className="mr-4">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-bold">John Doe</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Software Engineer
            </CardDescription>
          </div>
        </CardContent>
        <CardContent>
          <CardDescription className=" px-4 py-2">
            John Doe has consistently provided high-quality work in the
            projects, contributing significantly towards the success of the
            team.
          </CardDescription>
          <div className="mt-4 flex items-center justify-around">
            <Badge className="rounded bg-yellow-600 px-2 py-1 text-white">
              <StarHalf className="mr-1 h-5 w-5" /> 1042 Points
            </Badge>
            <Badge className="rounded bg-green-600 px-2 py-1 text-white">
              <Medal className="mr-1 h-5 w-5" /> 13 Medals
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 text-center">
          <a href="#0" className="text-blue-500 hover:underline">
            View Full Profile
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
