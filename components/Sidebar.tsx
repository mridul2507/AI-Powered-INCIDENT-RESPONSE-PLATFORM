export default function Sidebar() {
  return (
    <div className="w-73 h-screen bg-green-950 text-gray-200 p-6 flex flex-col">
      
      <h1 className="text-3xl font-bold mb-8">
        IR Assist
      </h1>

        <div className="flex flex-col gap-4">
            <p className="text-green-200 text-lg uppercase">
                General
            </p>
        <div className="text-lg flex flex-col gap-4 pl-4">
            <div>Dashboard</div>
            <div>Incidents</div>
            <div>Services</div>
            <div>Logs</div>
            <div>Analytics</div>
        </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
            <p className="text-green-200 text-lg uppercase">
                System
            </p>

            <div className="text-lg flex flex-col gap-4 pl-4">
                <div>Settings</div>
                <div>Dark Mode</div>
            </div>
        </div>



    {/*Bottom Section*/}
        <div className="mt-auto">
            <div className="border-t border-green-500 pt-4">
                <p className="font-semi-bold text-lg">
                    UserName
                </p>

                <p className="text-sm text-green-200">
                    Admin
                </p>

                <div className="mt-4 text-lg">
                    Log out
                </div>

            </div>
        </div>

    </div>
  );
}