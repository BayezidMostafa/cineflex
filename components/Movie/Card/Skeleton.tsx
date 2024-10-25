const Skeleton = () => {
  return (
    <div className="w-full animate-pulse space-y-2">
      <div className="bg-gray-300 h-40 sm:h-52 md:h-64 lg:h-80 w-full"></div>
      <div className="">
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
