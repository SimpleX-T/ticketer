export const DeleteModal = ({
  onclick,
  onclose,
}: {
  onclick: () => void;
  onclose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-primary-300 p-6 rounded-lg shadow-xl max-w-sm w-full border border-secondary/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Confirm Deletion
        </h3>
        <p className="text-secondary-100 mb-4">
          Are you sure you want to delete this ticket? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onclick();
              onclose();
            }}
            className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={onclose}
            className="flex-1 py-2 bg-primary-100 text-white rounded-md hover:bg-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
