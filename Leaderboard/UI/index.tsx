import { useQuery } from '@apollo/client';
import Layout from '@components/Common/Layout';
import MetaTags from '@components/Common/MetaTags';
import ActivityFeed from '@components/Leaderboard/ActivityFeed';
import ChallengeParticipation from '@components/Leaderboard/ChallengeParticipation';
import GamifiedLeaderboard from '@components/Leaderboard/LeaderboardTable';
import GamifiedRanking from '@components/Leaderboard/RankingTable';
import Loading from '@components/Shared/Loading';
import { Mixpanel } from '@lib/mixpanel';
import { PAGEVIEW } from '@lib/tracking';
import { APP_NAME } from '@qstn/data/constants';
import type { LeaderboardEntriesQuery } from '@qstn/graphql';
import { LeaderboardEntriesDocument } from '@qstn/graphql';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Leaderboard: NextPage = () => {
  const [leaderboard, setLeaderboard] = useState<any[] | null>();

  useQuery<LeaderboardEntriesQuery>(LeaderboardEntriesDocument, {
    fetchPolicy: 'no-cache',
    variables: {
      request: {
        leaderboardId: 1
      }
    },
    onCompleted: (data) => {
      setLeaderboard(data?.leaderboardEntries?.items);
    }
  });

  /*const [
    getNftUserGalleries,
    { error: errorNftUserGalleries, loading: loadingNftUserGalleries }
  ] = useNftUserGalleriesLazyQuery({
    fetchPolicy: 'no-cache'
  });

  const { data: mediaUser } = useQuery<UserNftsQuery>(UserNftsDocument, {
    fetchPolicy: 'no-cache',
    variables: {
      request: {
        profileIds: [profileId]
      }
    },
    onCompleted: (data) => {
      setMedias(data?.userNfts?.items);
    }
  });

 const fetchData = async () => {
    const { data: nftUserGalleriesData } = await getNftUserGalleries({
      variables: {
        request: {
          mediaIds: ['26','25','30','33'],
          limit: 10,
        },
      },
    });
    //console.log(businessData);
    setMedias(nftUserGalleriesData?.nftUserGalleries?.items);
  };

  useEffect(() => {
    fetchData();
  }, []);*/

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'leaderboard page' });
    console.log(leaderboard);
  }, [leaderboard]);

  return leaderboard ? (
    <Layout>
      <MetaTags title={`Leaderboard and Challenges • ${APP_NAME}`} />
      <div className="bg-qstn-50">
        <div className="cover-image" />
        <div className="landing-intro container relative mx-auto mb-12 flex flex-col">
          <div className="relative mt-6">
            <div>
              <p className="font-segoe-ui mb-1 text-5xl font-bold tracking-tight">
                Leaderboard
              </p>
              <p className="text-sm text-[#777E91]">Our surveys leaderboard</p>

              <div className="mb-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-2">
                  <div className="space-y-6 sm:px-6 lg:col-span-8 lg:px-0">
                    <GamifiedRanking leaderboard={leaderboard} />

                    <GamifiedLeaderboard leaderboard={leaderboard} />
                  </div>

                  <aside className="mt-[3.2rem] px-2 py-6 sm:px-6 lg:col-span-4 lg:px-0 lg:py-0">
                    <ActivityFeed />
                  </aside>

                  <div className="space-y-6 sm:px-6 lg:col-span-12 lg:px-0">
                    <ChallengeParticipation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <Loading />
  );
};

export default Leaderboard;
