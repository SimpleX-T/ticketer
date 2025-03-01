export const DeleteModal = ({
  onclick,
  onclose,
}: {
  onclick: () => void;
  onclose: () => void;
}) => {
  return (
    <div>
      <div className="fixed inset-0 z-50 w-full h-full bg-primary/20 backdrop-blur-md flex items-center justify-center">
        <div className="w-full flex items-center justify-center h-full relative">
          <div className="py-3 mb-8 w-full max-w-[400px] mx-auto mt-20 border border-secondary bg-secondary-300 rounded-md">
            <div className="w-full">
              <div className="mb-6 text-center">
                <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
                  Delete Ticket
                </h2>
              </div>

              <div className="text-center px-6 mb-2">
                <p className="text-white text-md">
                  Are you sure you want to delete this ticket?
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end pr-6 gap-4">
              <button
                onClick={onclose}
                className="flex items-center justify-center border text-secondary rounded-sm border-secondary p-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onclick();
                  onclose();
                }}
                className="flex items-center justify-center border border-secondary rounded-sm bg-red-200 text-primary-200 p-2 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
