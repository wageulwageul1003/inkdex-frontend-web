export const Hot = () => {
  return (
    <div className="flex flex-col gap-4">
      <p>인기 검색어</p>
      <div className="grid grid-cols-2 gap-2">
        {/* {hotItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-[16px] border border-gray-300 p-4"
          >
            <p>{index + 1}</p>
            <p>{item.label}</p>
          </div>
        ))} */}
      </div>
    </div>
  );
};
