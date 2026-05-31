export default function SettingsPage() {
  return (
    <div className="bg-white min-h-screen p-8">

      <h1 className="text-3xl font-bold text-green-900 mb-8">
        Settings
      </h1>

      <div className="grid grid-cols-[250px_1fr] gap-8">

        {/* Sidebar */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 h-fit">

          <div className="space-y-2">

            <button className="w-full text-left px-4 py-3 rounded-xl bg-green-50 text-green-900 font-medium">
              Notifications
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">
              AI Analysis
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">
              Automation
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">
              Appearance
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">
              Integrations
            </button>

          </div>

        </div>

        {/* Content */}

        <div className="space-y-6">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Notification Preferences
            </h2>

            <p className="text-gray-500 mb-6">
              Configure how alerts and incidents are delivered.
            </p>

            <div className="space-y-5">

              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <p className="font-medium">
                    Email Alerts
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive incident updates via email.
                  </p>
                </div>

                <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                  ON
                </button>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <p className="font-medium">
                    Slack Notifications
                  </p>

                  <p className="text-sm text-gray-500">
                    Send alerts directly to Slack.
                  </p>
                </div>

                <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                  ON
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    SMS Alerts
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive critical alerts on mobile.
                  </p>
                </div>

                <button className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                  OFF
                </button>
              </div>

            </div>

          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Incident Severity Rules
            </h2>

            <p className="text-gray-500 mb-6">
              Define which incident levels trigger notifications.
            </p>

            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <span className="text-red-600 font-medium">
                  Critical
                </span>

                <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                  Enabled
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-amber-600 font-medium">
                  Warning
                </span>

                <button className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                  Enabled
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">
                  Info
                </span>

                <button className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                  Disabled
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}