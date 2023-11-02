import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@components/ui/tooltip';
import { Gift, Sticker, Trophy } from 'lucide-react';
import React from 'react';

const ChallengeParticipation = () => {
  return (
    <div>
      <h3 className="mb-6 mt-12 text-3xl font-bold">
        Challenges and Activities
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle>Reward Points</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <div className="text-lg font-bold">120</div>
            <Trophy className="h-6 w-6 text-yellow-400" />
          </CardContent>
          <CardFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>How do I use these?</TooltipTrigger>
                <TooltipContent>
                  <p>
                    Redeem these points in the Rewards Store to get exciting
                    perks!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
        {[1, 2, 3].map((challenge) => (
          <Card key={challenge} className="bg-white">
            <CardHeader>
              <CardTitle>Challenge {challenge}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Participate in this exciting challenge and stand a chance to
                earn cool rewards!
              </CardDescription>
              <Badge variant="outline" className="mt-2">
                <Sticker className="mr-2 h-4 w-4" />5 Reward Points!
              </Badge>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Gift className="mr-2 h-4 w-4" />
                Participate
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChallengeParticipation;
