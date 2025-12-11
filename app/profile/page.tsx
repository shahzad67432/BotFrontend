"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { 
  Mail, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  MoreVertical,
  Download,
  Filter,
  Search,
  ChevronRight,
  Award,
  Activity,
  Zap
} from "lucide-react";
import { getUserProfileData } from "../actions/profile";
import { HeaderPage } from "../Header";

type EmailHistory = {
  id: number;
  receiverEmail: string;
  receiverName: string;
  emailType: string;
  sentAt: Date;
  status: string;
};

type UserProfile = {
  name: string;
  email: string;
  credits: number;
  emailHistory: EmailHistory[];
};

export default function ProfilePage() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      window.location.href = "/login";
    }
    setJwt(token);
  }, []);

  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!jwt) throw new Error("No token");
      return await getUserProfileData(jwt);
    },
    enabled: !!jwt,
    staleTime: 5 * 60 * 1000,
  });

  const getEmailTypeColor = (type: string) => {
    switch (type) {
      case "sick_leave":
        return "bg-red-50 text-red-700 border-red-200";
      case "general_leave":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "urgent_work":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "extension":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "meeting":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getEmailTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Filter emails based on selected filter and search query
  const filteredEmails = profile?.emailHistory?.filter((email) => {
    const matchesFilter = 
      selectedFilter === 'all' || 
      (selectedFilter === 'leave' && email.emailType.includes('leave')) ||
      (selectedFilter === 'urgent' && email.emailType === 'urgent_work');
    
    const matchesSearch = 
      email.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.receiverEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.emailType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  }) || [];

  // Get member since date (createdAt from first email or default to current month)
  const memberSince = profile?.emailHistory?.length > 0 
    ? new Date(profile.emailHistory[profile.emailHistory.length - 1].sentAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // Calculate recent activity for credit timeline
  const recentActivity = profile?.emailHistory?.slice(0, 3).map((email) => ({
    type: email.emailType,
    date: email.sentAt
  })) || [];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "sick_leave": return "bg-red-500";
      case "general_leave": return "bg-blue-500";
      case "urgent_work": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const sentDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - sentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-red-600" size={28} />
          </div>
          <p className="text-gray-900 font-medium mb-2">Failed to load profile</p>
          <p className="text-gray-500 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const creditsPercentage = ((profile?.credits || 0) / 10) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPage />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#cc39f5] flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                  {profile?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                    {profile?.name || "User"}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={16} />
                    {profile?.email}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = '/'}
                className="hidden md:block px-5 py-2 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white text-sm"
              >
                Send Email
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={16} />
                  <span>Total Emails</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {profile?.emailHistory?.length || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {profile?.emailHistory?.length > 0 ? 'All delivered' : 'No emails yet'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle size={16} />
                  <span>Success Rate</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {profile?.emailHistory?.length > 0 ? '100%' : '0%'}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </div>

              <div className="space-y-1 hidden md:block">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Zap size={16} />
                  <span>Credits Used</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {10 - (profile?.credits || 0)}
                </p>
                <p className="text-xs text-gray-500">Out of 10 total</p>
              </div>

              <div className="space-y-1 hidden md:block">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Award size={16} />
                  <span>Member Since</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{memberSince}</p>
                <p className="text-xs text-gray-500">Active user</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credits Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Credits</h3>
                <Activity size={20} className="text-gray-400" />
              </div>

              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{profile?.credits || 0}</p>
                    <p className="text-sm text-gray-600">Available credits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">/ 10</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#cc39f5] transition-all duration-500"
                    style={{ width: `${creditsPercentage}%` }}
                  />
                </div>
              </div>

              <button
                disabled={profile?.credits !== 0}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-100 flex items-center justify-center gap-2 border-2 ${
                  profile?.credits === 0
                    ? "bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] text-white"
                    : "bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CreditCard size={18} />
                Get More Credits
              </button>

              {profile?.credits !== 0 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Purchase available when credits reach zero
                </p>
              )}

              {/* Credit Usage Timeline */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
                        <span className="text-gray-600">1 credit used</span>
                        <span className="text-gray-400 text-xs ml-auto">{getRelativeTime(activity.date)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </div>
          </div>

          {/* Email History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 hover:text-[#cc39f5]">
                      <Download size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 hover:text-[#cc39f5]">
                      <Filter size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-100 text-sm font-medium ${
                        selectedFilter === 'all'
                          ? 'bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] text-white'
                          : 'bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] text-gray-700 hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] hover:text-[#cc39f5]'
                      } ${selectedFilter === 'all' ? 'hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px]' : ''} active:shadow-none active:translate-y-[${selectedFilter === 'all' ? '4px' : '3px'}]`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedFilter('leave')}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-100 text-sm font-medium ${
                        selectedFilter === 'leave'
                          ? 'bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] text-white'
                          : 'bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] text-gray-700 hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] hover:text-[#cc39f5]'
                      } ${selectedFilter === 'leave' ? 'hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px]' : ''} active:shadow-none active:translate-y-[${selectedFilter === 'leave' ? '4px' : '3px'}]`}
                    >
                      Leave
                    </button>
                    <button
                      onClick={() => setSelectedFilter('urgent')}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-100 text-sm font-medium ${
                        selectedFilter === 'urgent'
                          ? 'bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] text-white'
                          : 'bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] text-gray-700 hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] hover:text-[#cc39f5]'
                      } ${selectedFilter === 'urgent' ? 'hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px]' : ''} active:shadow-none active:translate-y-[${selectedFilter === 'urgent' ? '4px' : '3px'}]`}
                    >
                      Urgent
                    </button>
                  </div>
                </div>
              </div>

              {/* Email List */}
              <div className="divide-y divide-gray-200">
                {filteredEmails.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="text-gray-400" size={28} />
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      {searchQuery || selectedFilter !== 'all' ? 'No matching emails' : 'No emails yet'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {searchQuery || selectedFilter !== 'all' 
                        ? 'Try adjusting your filters or search query'
                        : 'Start sending emails to see your history here'
                      }
                    </p>
                  </div>
                ) : (
                  filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getEmailTypeColor(
                                email.emailType
                              )}`}
                            >
                              {getEmailTypeLabel(email.emailType)}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                              <CheckCircle size={12} />
                              <span className="font-medium capitalize">{email.status}</span>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 mb-1 truncate">
                            {email.receiverName}
                          </p>
                          <p className="text-sm text-gray-600 truncate">{email.receiverEmail}</p>
                        </div>

                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                              <Calendar size={14} />
                              {new Date(email.sentAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(email.sentAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredEmails.length > 0 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredEmails.length}</span> of{" "}
                    <span className="font-medium">{profile?.emailHistory?.length || 0}</span> emails
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 text-sm font-medium text-gray-700 hover:text-[#cc39f5] disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      Previous
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 text-sm font-medium text-gray-700 hover:text-[#cc39f5] disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}