import React, { useState } from 'react';
import { Users, Eye, TrendingUp, IndianRupee, Laptop, RefreshCw, Clock, AlertTriangle, Activity } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const VisitorAnalytics: React.FC = () => {
  const { analytics, visitorLogs, refreshLogs } = useStore();
  const [filterDevice, setFilterDevice] = useState<string>('All');
  const [logSearch, setLogSearch] = useState<string>('');

  const filteredLogs = visitorLogs.filter((log) => {
    const matchesDevice = filterDevice === 'All' || log.deviceType === filterDevice;
    const matchesSearch =
      !logSearch ||
      log.userName?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.pageVisited.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.browser.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ipAddress.includes(logSearch);
    return matchesDevice && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Visitors</p>
              <h3 className="text-2xl font-black text-white mt-1">{analytics.totalVisitors}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-emerald-400 font-semibold space-x-1">
            <Activity className="w-3.5 h-3.5" />
            <span>{analytics.activeVisitorsNow} live sessions now</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                ₹{analytics.totalRevenue.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-medium">
            From {analytics.totalOrders} customer order(s)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-2xl font-black text-indigo-300 mt-1">{analytics.conversionRate}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-medium">
            Orders per unique website visitor
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
              <h3 className={`text-2xl font-black mt-1 ${analytics.lowStockProducts > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                {analytics.lowStockProducts}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-medium">
            {analytics.lowStockProducts > 0 ? 'Needs stock refill soon' : 'All products well stocked'}
          </div>
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <span>Live Customer Visitor Activity Logs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time records of customers visiting pages on your Vibe Store website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 w-40 sm:w-48"
              />
            </div>

            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Devices</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile Phone">Mobile Phone</option>
              <option value="Tablet">Tablet</option>
            </select>

            <button
              onClick={refreshLogs}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl border border-slate-700 transition"
              title="Refresh Activity Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No visitor logs matched your filter criteria yet. As customers open your site, logs will appear automatically here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Visitor Name / Email</th>
                  <th className="px-4 py-3">Page Visited</th>
                  <th className="px-4 py-3">Device & Browser</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3 text-right">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredLogs.slice(0, 50).map((log) => {
                  const dateFormatted = new Date(log.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition font-sans">
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        <span className="flex items-center space-x-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{dateFormatted}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold border border-indigo-500/30">
                            {log.userName?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <span className="block text-slate-200">{log.userName || 'Guest Visitor'}</span>
                            {log.userEmail && (
                              <span className="block text-[10px] text-slate-400 font-normal">{log.userEmail}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 font-medium text-[10px]">
                          {log.pageVisited}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        <span className="flex items-center space-x-1.5 text-xs">
                          <Laptop className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.deviceType} ({log.browser})</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-indigo-400 text-[11px]">
                        {log.ipAddress}
                      </td>

                      <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                        {log.location || 'India'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
