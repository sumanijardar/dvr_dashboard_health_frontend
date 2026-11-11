import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Pagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange
}) {
  const { isDark } = useTheme();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={`p-4 border-t rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors duration-200 ${
        isDark
          ? 'border-slate-800/80 bg-[#090e14] text-slate-400'
          : 'border-slate-200 bg-white text-slate-900 font-semibold shadow-sm'
      }`}
    >
      {/* Left: Showing entries */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span>Showing</span>
          <span className={`font-mono ${isDark ? 'text-white font-semibold' : 'text-slate-950 font-black'}`}>
            {startItem} to {endItem}
          </span>
          <span>of</span>
          <span className={`font-mono ${isDark ? 'text-white font-semibold' : 'text-slate-950 font-black'}`}>
            {totalItems}
          </span>
          <span>entries</span>
        </div>

        <div className={`flex items-center gap-1.5 border-l pl-3 ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
          <span className={isDark ? 'text-slate-400' : 'text-slate-900 font-bold'}>Rows:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className={`border rounded px-2 py-0.5 font-mono text-xs focus:outline-none cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-[#0e141b] text-slate-300 focus:border-emerald-500'
                : 'border-slate-300 bg-white text-slate-950 font-bold focus:border-emerald-600 shadow-2xs'
            }`}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Right: Pagination Buttons */}
      <div className="flex items-center gap-2 font-mono">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-2.5 py-1.5 rounded-lg border transition disabled:opacity-40 cursor-pointer ${
              isDark
                ? 'bg-slate-800/70 border-transparent text-slate-400 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-950 font-extrabold hover:bg-slate-200'
            }`}
          >
            Prev
          </button>

          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className={`px-2 ${isDark ? 'text-slate-600' : 'text-slate-500 font-bold'}`}>
                  ...
                </span>
              );
            }
            const isActive = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold shadow-neon-green'
                      : 'bg-emerald-600 text-white border border-emerald-600 font-black shadow-sm'
                    : isDark
                    ? 'hover:bg-slate-800 text-slate-400'
                    : 'text-slate-950 hover:bg-slate-100 font-bold'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-2.5 py-1.5 rounded-lg border transition disabled:opacity-40 cursor-pointer ${
              isDark
                ? 'bg-slate-800/70 border-transparent text-slate-400 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-950 font-extrabold hover:bg-slate-200'
            }`}
          >
            Next
          </button>
        </div>

        {/* Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll To Top"
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ml-2 cursor-pointer ${
            isDark
              ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border-emerald-500/30 shadow-neon-green'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
          }`}
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
