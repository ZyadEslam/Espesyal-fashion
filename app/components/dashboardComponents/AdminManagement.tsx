"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Trash2, UserPlus, Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cachedFetchJson, cacheStrategies } from "@/app/utils/cachedFetch";

interface Admin {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const AdminManagement = React.memo(() => {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Add admin form state
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  // Fetch admins
  const fetchAdmins = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await cachedFetchJson<{ admins: Admin[]; error?: string }>(
        "/api/admin/manage",
        cacheStrategies.admins(force)
      );
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAdmins(data.admins || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Add admin handler
  const handleAddAdmin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    try {
      setAdding(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/admin/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add admin");
      }

      setSuccess(data.message || "Admin added successfully");
      setEmail("");
      await fetchAdmins(true); // Force refresh after adding
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setAdding(false);
    }
  }, [email, fetchAdmins]);

  // Remove admin handler
  const handleRemoveAdmin = useCallback(async (adminEmail: string, adminId: string) => {
    // Prevent self-removal
    if (session?.user?.email?.toLowerCase() === adminEmail.toLowerCase()) {
      setError("You cannot remove your own admin access");
      return;
    }

    // Confirmation
    if (!confirm(`Are you sure you want to remove admin access from ${adminEmail}?`)) {
      return;
    }

    try {
      setRemoving(adminId);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/admin/manage?email=${encodeURIComponent(adminEmail)}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove admin");
      }

      setSuccess(data.message || "Admin removed successfully");
      await fetchAdmins(true); // Force refresh after removing
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove admin");
    } finally {
      setRemoving(null);
    }
  }, [session, fetchAdmins]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Admin Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage admin access to the dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Add Admin Form */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
            Add New Admin
          </h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dashboard-input w-full"
                  placeholder="Enter admin email address"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={adding || !email.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-orange text-white font-medium rounded-md hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {adding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Admin
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Note: The user must sign in at least once before being granted admin access.
            </p>
          </form>
        </div>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
            Current Admins ({admins.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No admins found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => {
                const isCurrentUser = session?.user?.email?.toLowerCase() === admin.email.toLowerCase();
                const isRemoving = removing === admin._id;

                return (
                  <div
                    key={admin._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{admin.name || "No name"}</p>
                        <p className="text-sm text-gray-600 truncate">{admin.email}</p>
                      </div>
                      {isCurrentUser && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange/10 text-orange rounded-md whitespace-nowrap flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveAdmin(admin.email, admin._id)}
                      disabled={isRemoving || isCurrentUser}
                      className="sm:ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                      title={isCurrentUser ? "You cannot remove your own admin access" : "Remove admin"}
                    >
                      {isRemoving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AdminManagement.displayName = "AdminManagement";

export default AdminManagement;

