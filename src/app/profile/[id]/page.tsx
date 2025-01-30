export default function UserProfile({ params }: { params: { id?: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>
        <hr className="mb-4 border-gray-300" />
        <p className="text-lg text-gray-600 mb-2">Profile Details</p>

        {params?.id ? (
          <div className="p-3 mt-2 rounded bg-orange-500 text-white text-xl font-semibold inline-block">
            ID: {params.id}
          </div>
        ) : (
          <p className="text-red-500 font-medium">User ID not found</p>
        )}
      </div>
    </div>
  );
}
