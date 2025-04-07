import { useNavigate } from 'react-router-dom';

const ReportTable = ({ reports }) => {
  const navigate = useNavigate();
  
  if (!reports || reports.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300 mt-8">No reports found.</p>
    );
  }

  return (
    <div className="overflow-x-auto mt-12">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
        User Reports
      </h2>
      <table className="min-w-full table-auto border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden dark:bg-gray-800">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-3 border text-gray-800 dark:text-white">Username</th>
            <th className="p-3 border text-gray-800 dark:text-white">Post Title</th>
            <th className="p-3 border text-gray-800 dark:text-white">Comment Text</th>
            <th className="p-3 border text-gray-800 dark:text-white">Reason</th>
            <th className="p-3 border text-gray-800 dark:text-white">Date</th>
            <th className="p-3 border text-gray-800 dark:text-white">Action</th>
          </tr>
        </thead>
        <tbody className="dark:bg-gray-900">
          {reports.map((report) => (
            <tr key={report._id} className="text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
              <td className="p-3 border text-gray-800 dark:text-white">{report.username}</td>
              <td className="p-3 border text-gray-800 dark:text-white">{report.postTitle}</td>
              <td className="p-3 border text-gray-800 dark:text-white">{report.commentText || '-'}</td>
              <td className="p-3 border text-gray-800 dark:text-white">{report.report}</td>
              <td className="p-3 border text-gray-800 dark:text-white">
                {new Date(report.date).toLocaleString()}
              </td>
              <td className="p-3 border text-center text-gray-800 dark:text-white">
                <button
                  onClick={() => navigate(`/forum/post/${report.postId}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                >
                  View Post
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
