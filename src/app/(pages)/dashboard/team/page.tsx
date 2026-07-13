import InviteUserForm from "@/components/InviteUserForm";

export const metadata = {
  title: "Team Management | IR Assist",
};

export default function TeamManagementPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-green-400">Team Management</h1>
        <p className="text-gray-500 mt-2">
          Manage your organization&apos;s members, assign roles, and send out new invitations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <InviteUserForm />
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 h-full flex flex-col items-center justify-center text-center">
          <div className="text-gray-300 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Team Directory</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Pending invitations and active members will be listed here. When invited users sign in, their accounts are automatically connected.
          </p>
        </div>
      </div>
    </div>
  );
}