import React from "react";

const CheckboxList = ({
  title,
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  isSelectAll,
}) => {
  return (
    <div className="rounded-lg bg-white py-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                <input
                  type="checkbox"
                  checked={isSelectAll}
                  onChange={onSelectAll}
                  className="h-5 w-5 rounded-md text-[#00A9B5] focus:ring-2 focus:ring-[#00A9B5]"
                />
                <label className="ml-2">닉네임</label>
              </th>
              <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                아이디
              </th>
              <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                가입일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-sm text-gray-900 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => onSelectUser(user._id)}
                    className="h-5 w-5 rounded-md mr-2 text-[#00A9B5] focus:ring-2 focus:ring-[#00A9B5]"
                  />
                  {user.profile.nickname || "없음"}
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-500">
                  {user.username}
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-500">
                  {new Date(user.profile.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckboxList;
