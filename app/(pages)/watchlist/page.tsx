"use client";

import React, { useEffect, useState } from "react";
import { getWatchList, toggleWatchList } from "@/app/actions/movieAction";
import { Movie } from "@/lib/interfaces";
import Card from "@/components/Movie/Card/Card";
import Skeleton from "@/components/Movie/Card/Skeleton";

const WatchListPage: React.FC = () => {
  const [watchList, setWatchList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchWatchList() {
      setLoading(true);
      const data = await getWatchList();
      setWatchList(data);
      setLoading(false);
    }
    fetchWatchList();
  }, []);

  const handleToggleWatchList = async (movie: Movie) => {
    // Optimistically update the UI
    setWatchList((prevList) => {
      const isInWatchList = prevList.some((item) => item.id === movie.id);
      if (isInWatchList) {
        return prevList.filter((item) => item.id !== movie.id);
      } else {
        return [...prevList, movie];
      }
    });

    await toggleWatchList(movie);

    // Optionally re-fetch to ensure accuracy
    const updatedList = await getWatchList();
    setWatchList(updatedList);
  };

  return (
    <div className="min-h-screen mt-5">
      <h1 className="text-2xl font-bold mb-4">Your Watch list</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} />
            ))}
        </div>
      ) : watchList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {watchList.map((movie) => (
            <Card
              data={movie}
              key={movie.id}
              onToggleWatchList={() => handleToggleWatchList(movie)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-center">Your watch list is empty.</p>
      )}
    </div>
  );
};

export default WatchListPage;
