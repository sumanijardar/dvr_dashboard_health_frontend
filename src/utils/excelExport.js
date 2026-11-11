/**
 * Export DVR sites data to a comprehensive CSV/Excel format directly in the browser
 * Includes all standard fields from SAR DVR Live API Engine with calculated Aging
 */
export function exportSitesToCsv(sites, filename = 'DVR_Sites_Report.csv') {
  if (!sites || !sites.length) {
    alert('No data available to export.');
    return;
  }

  const headers = [
    'ATM ID',
    'Unique ID',
    'Customer',
    'Bank',
    'IP Address',
    'Port',
    'Username',
    'Password',
    'DVR Name',
    'Live',
    'DVR Status',
    'Ping Status',
    'Login Status',
    'CAM 1',
    'CAM 2',
    'CAM 3',
    'CAM 4',
    'CAM 5',
    'HDD',
    'Capacity',
    'Free Space',
    'Recording From',
    'Recording To',
    'Recording Aging (Days)',
    'DVR Time',
    'Time Diff',
    'Network Status',
    'Network Status Date',
    'Last Communication',
    'CDate',
    'Address',
    'City',
    'State'
  ];

  const csvRows = [];
  csvRows.push(headers.join(','));

  const clean = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  for (const site of sites) {
    // Calculate aging if not already present
    let aging = site.recording_aging || '-';
    if ((!aging || aging === '-') && site.recording_from && site.recording_to) {
      try {
        const d1 = new Date(String(site.recording_from).split(' ')[0]);
        const d2 = new Date(String(site.recording_to).split(' ')[0]);
        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
          const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
          if (diff >= 0) aging = `${diff} Days`;
        }
      } catch {
        aging = '-';
      }
    }

    const values = [
      clean(site.atmid || site.atmId || ''),
      clean(site.unique_id || site.uniqueId || ''),
      clean(site.customer || ''),
      clean(site.bank || ''),
      clean(site.IPAddress || site.ipAddress || ''),
      clean(site.port || ''),
      clean(site.UserName || site.username || ''),
      clean(site.Password || site.password || ''),
      clean(site.dvrname || site.dvrName || ''),
      clean(site.live || ''),
      clean(site.status || ''),
      clean(site.pingStatus || (site.raw_status === '1' ? 'OK' : 'FAIL')),
      clean(site.login_status || ''),
      clean(site.cam1 || ''),
      clean(site.cam2 || ''),
      clean(site.cam3 || ''),
      clean(site.cam4 || ''),
      clean(site.cam5 || ''),
      clean(site.hdd || ''),
      clean(site.capacity || ''),
      clean(site.freespace || ''),
      clean(site.recording_from || ''),
      clean(site.recording_to || ''),
      clean(aging),
      clean(site.dvr_time || ''),
      clean(site.time_diff || ''),
      clean(site.network_status || ''),
      clean(site.network_status_dt || ''),
      clean(site.last_communication || ''),
      clean(site.cdate || ''),
      clean(site.address || site.location || ''),
      clean(site.city || ''),
      clean(site.state || '')
    ];
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
