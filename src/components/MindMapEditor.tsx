import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  NodeProps,
  useReactFlow,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

interface MindMapEditorProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Edge | Connection) => void;
  onPaneDoubleClick: (event: React.MouseEvent) => void;
}

// Custom node component with editable label, handles e botão de deletar
const EditableNode: React.FC<NodeProps> = (props) => {
  const { id, data, selected } = props;
  const { setNodes, setEdges } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label || '');

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const finishEdit = () => {
    setEditing(false);
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label: value } } : n));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEdit();
    }
  };

  // Deletar nó e suas conexões
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter(n => n.id !== id));
    setEdges((eds) => eds.filter(edge => edge.source !== id && edge.target !== id));
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`bg-gray-800 border-2 rounded-lg px-4 py-2 min-w-[80px] min-h-[32px] flex items-center justify-center shadow-lg transition-all duration-150 relative ${selected ? 'border-pink-400' : 'border-gray-600'} cursor-pointer`}
      style={{ userSelect: 'none' }}
    >
      {/* Handle de entrada */}
      <Handle type="target" position={Position.Left} style={{ background: '#f472b6', width: 12, height: 12, borderRadius: 6, left: -10 }} />
      {/* Handle de saída */}
      <Handle type="source" position={Position.Right} style={{ background: '#f472b6', width: 12, height: 12, borderRadius: 6, right: -10 }} />
      {editing ? (
        <input
          className="bg-gray-900 text-pink-200 font-mono rounded px-1 py-0.5 outline-none border border-pink-400"
          value={value}
          autoFocus
          onChange={handleChange}
          onBlur={finishEdit}
          onKeyDown={handleKeyDown}
          style={{ minWidth: 60 }}
        />
      ) : (
        <span className="text-pink-200 font-mono text-sm truncate" title={data.label}>{data.label}</span>
      )}
      {/* Botão de deletar, só aparece se selecionado */}
      {selected && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 bg-pink-600 hover:bg-pink-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow border border-white/20"
          title="Deletar bloco"
        >
          ×
        </button>
      )}
    </div>
  );
};

const nodeTypes = { editable: EditableNode };

const MindMapEditor: React.FC<MindMapEditorProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onPaneDoubleClick,
}) => {
  // Força todos os nós a serem do tipo 'editable'
  const displayNodes = nodes.map(n => ({ ...n, type: 'editable' }));
  const { setNodes, setEdges, project } = useReactFlow();

  // Função para adicionar bloco pelo botão
  const handleAddNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'editable',
      data: { label: 'Novo Bloco' },
      position: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 100 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Corrigir onPaneDoubleClick para usar coordenadas do React Flow
  const handlePaneDoubleClick = (event: React.MouseEvent) => {
    // Pega a posição relativa ao canvas do React Flow
    const reactFlowBounds = (event.target as HTMLDivElement).getBoundingClientRect();
    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'editable',
      data: { label: 'Novo Bloco' },
      position,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Handler para remover aresta com duplo clique
  const handleEdgeDoubleClick = useCallback((event, edge) => {
    setEdges((eds) => eds.filter(e => e.id !== edge.id));
  }, [setEdges]);

  return (
    <div style={{ width: '100%', height: '80vh', background: '#18181b', borderRadius: 12, position: 'relative' }}>
      <button
        className="absolute top-2 left-2 z-20 bg-pink-600 hover:bg-pink-700 text-white rounded px-3 py-1 text-xs font-mono shadow"
        onClick={handleAddNode}
        type="button"
      >
        + Adicionar Bloco
      </button>
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneDoubleClick={handlePaneDoubleClick}
        onEdgeDoubleClick={handleEdgeDoubleClick}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} color="#444" variant="dots" />
      </ReactFlow>
      <div className="text-gray-400 text-xs mt-2 font-mono">Dica: Clique duplo no fundo para adicionar um novo nó. Clique duplo no nó para editar. Clique no × para apagar bloco. Arraste das bolinhas para conectar. Dê dois cliques na linha para desconectar blocos.</div>
    </div>
  );
};

export default MindMapEditor; 