"use client";

import { useRouter } from "next/navigation";
import { useSiteContext } from "@/context/SiteContext";

export default function NotFound() {
  const router = useRouter();
  const { siteDisabled, toggleSiteDisabled } = useSiteContext();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/mohamad-logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/mohamadmon/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Developer Control Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Warning:</strong> This control panel gives you power to disable the entire site.
                Use responsibly.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Emergency Site Control</h2>
          <p className="mb-4">
            Toggle the switch below to immediately display &quot;Give me my money&quot; message across the entire site.
            All site content will be temporarily hidden until toggled back off.
          </p>

          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-900">Site Status: {siteDisabled ? "DISABLED" : "Normal"}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={siteDisabled}
                onChange={toggleSiteDisabled}
                className="sr-only peer"
                aria-label="Toggle site status"
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer ${siteDisabled ? 'after:translate-x-full after:border-white bg-red-600' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-8">
          <p>This panel is only accessible to Mohamad. If you&apos;re seeing this and you&apos;re not Mohamad, please log out immediately.</p>
        </div>
      </div>
    </div>
  );
} 