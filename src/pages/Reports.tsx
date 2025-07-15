
import React from 'react';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';
import CalendarView from '@/components/calendar/CalendarView';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Relatórios Interativos</h2>
          <InteractiveReportsTable />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Calendário</h2>
          <CalendarView />
        </div>
      </div>
    </div>
  );
};

export default Reports;
