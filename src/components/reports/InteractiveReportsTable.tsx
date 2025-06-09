
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="border-b border-gray-200/50 bg-gray-50/80">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium text-gray-900">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={exportToExcel}
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white border-gray-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="bg-gray-50/80 sticky top-0">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100/80 font-medium"
                  onClick={() => handleSort('name')}
                >
                  Nome {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100/80 font-medium"
                  onClick={() => handleSort('value')}
                >
                  Valor {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100/80 font-medium"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100/80 font-medium"
                  onClick={() => handleSort('date')}
                >
                  Data {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                {data[0]?.company && (
                  <TableHead className="font-medium">Empresa</TableHead>
                )}
                {data[0]?.priority && (
                  <TableHead className="font-medium">Prioridade</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                      item.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  {item.company && <TableCell>{item.company}</TableCell>}
                  {item.priority && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                        item.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
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
