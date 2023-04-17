interface MissingCardProps {
  title: string;
  description: string;
  buttonLabel?: string;
  onBtnClick?: () => void;
}

const MissingDataCard = ({
  title,
  description,
  buttonLabel,
  onBtnClick,
}: MissingCardProps) => {
  return (
    <div className="w-full rounded-md border border-gray-300 p-3 my-5  ">
      <h1 className="text-lg  text-cxBlue font-semibold md:w-1/2 my-1">
        {title}
      </h1>

      <p className="my-1 text-gray-400 text-sm font-normal">{description}</p>

      <div className="w-full flex justify-end">
        {buttonLabel && (
          <button
            className="bg-cxBlue text-white font-semibold text-sm py-2 px-5 flex justify-center items-center  rounded"
            onClick={onBtnClick}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default MissingDataCard;
