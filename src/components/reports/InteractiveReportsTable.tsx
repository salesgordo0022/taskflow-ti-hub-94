
import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as XLSX from 'xlsx';

interface ReportData {
  id: string;
  name: string;
  value: number;
  status: string;
  date: string;
  company?: string;
  priority?: string;
}

interface InteractiveReportsTableProps {
  title: string;
  data: ReportData[];
  onClose: () => void;
}

const InteractiveReportsTable = ({ title, data, onClose }: InteractiveReportsTableProps) => {
  const [sortField, setSortField] = useState<keyof ReportData>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof ReportData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '_')}_report.xlsx`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[80vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-blue-500/30 shadow-2xl shadow-blue-500/20">
        <CardHeader className="border-b border-blue-500/20 bg-gray-800/80">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium text-blue-300 font-mono">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={exportToExcel}
                variant="outline"
                size="sm"
                className="bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-300 font-mono"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-700/50 text-gray-300 font-mono"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="bg-gray-800/80 sticky top-0">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-700/50 font-medium text-blue-300 font-mono"
                  onClick={() => handleSort('name')}
                >
                  Nome {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-700/50 font-medium text-blue-300 font-mono"
                  onClick={() => handleSort('value')}
                >
                  Valor {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-700/50 font-medium text-blue-300 font-mono"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-700/50 font-medium text-blue-300 font-mono"
                  onClick={() => handleSort('date')}
                >
                  Data {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                {data[0]?.company && (
                  <TableHead className="font-medium text-blue-300 font-mono">Empresa</TableHead>
                )}
                {data[0]?.priority && (
                  <TableHead className="font-medium text-blue-300 font-mono">Prioridade</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-800/50 border-gray-700">
                  <TableCell className="font-medium text-white font-mono">{item.name}</TableCell>
                  <TableCell className="text-gray-300 font-mono">{item.value}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium font-mono ${
                      item.status === 'Concluído' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      item.status === 'Em Andamento' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      item.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300 font-mono">{item.date}</TableCell>
                  {item.company && <TableCell className="text-gray-300 font-mono">{item.company}</TableCell>}
                  {item.priority && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium font-mono ${
                        item.priority === 'Alta' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        item.priority === 'Média' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {item.priority}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveReportsTable;
