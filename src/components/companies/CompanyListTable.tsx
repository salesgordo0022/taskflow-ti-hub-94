import { useState } from 'react';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import CompanyEditModal from './CompanyEditModal';

interface CompanyListTableProps {
  companies: Company[];
  onUpdate: (company: Company) => void;
}

const segmentos = [
  { value: '', label: 'Todos os Segmentos' },
  { value: 'comercio', label: 'Comércio' },
  { value: 'industria', label: 'Indústria' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'rural', label: 'Rural' },
  { value: 'outros', label: 'Outros' },
];

const regimes = [
  { value: '', label: 'Todos os Regimes' },
  { value: 'simples', label: 'Simples' },
  { value: 'presumido', label: 'Presumido' },
  { value: 'real', label: 'Real' },
  { value: 'mei', label: 'MEI' },
];

const CompanyListTable = ({ companies, onUpdate }: CompanyListTableProps) => {
  const [segmento, setSegmento] = useState('');
  const [regime, setRegime] = useState('');

  const filtered = companies.filter(c =>
    (segmento === '' || c.segment === segmento) &&
    (regime === '' || c.regime === regime)
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="bg-gray-900 border border-gray-700 text-gray-200 rounded px-3 py-2"
          value={segmento}
          onChange={e => setSegmento(e.target.value)}
        >
          {segmentos.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="bg-gray-900 border border-gray-700 text-gray-200 rounded px-3 py-2"
          value={regime}
          onChange={e => setRegime(e.target.value)}
        >
          {regimes.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="text-gray-400 ml-auto text-sm">Total: {filtered.length}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-950">
        <table className="min-w-full text-sm text-gray-200">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2 text-left">Empresa</th>
              <th className="px-3 py-2 text-left">CNPJ</th>
              <th className="px-3 py-2 text-left">Responsável</th>
              <th className="px-3 py-2 text-left">Segmento</th>
              <th className="px-3 py-2 text-left">Regime</th>
              <th className="px-3 py-2 text-left">Nível</th>
              <th className="px-3 py-2 text-left">Automação</th>
              <th className="px-3 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-6">Nenhuma empresa encontrada.</td>
              </tr>
            )}
            {filtered.map(company => (
              <tr key={company.id} className="border-t border-gray-800 hover:bg-gray-900 transition">
                <td className="px-3 py-2 font-medium">{company.name}</td>
                <td className="px-3 py-2">{company.cnpj}</td>
                <td className="px-3 py-2">{company.responsiblePerson}</td>
                <td className="px-3 py-2 capitalize">{company.segment}</td>
                <td className="px-3 py-2 capitalize">{company.regime}</td>
                <td className="px-3 py-2 capitalize">{company.level}</td>
                <td className="px-3 py-2">{company.isAutomated ? 'Sim' : 'Não'}</td>
                <td className="px-3 py-2">
                  <CompanyEditModal company={company} onSave={onUpdate} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyListTable; 