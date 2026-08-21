import React, { useState } from 'react';
import { 
  Network, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  Activity, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  Eye,
  GitBranch
} from 'lucide-react';
import { BIOMARKER_GRAPH_NODES, BIOCHEMICAL_INTERACTIONS } from '../../data/biomarkerGraphData';

export default function BiomarkerKnowledgeGraphView({ activeProfile }) {
  const [selectedNodeId, setSelectedNodeId] = useState('node-tsh');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const selectedNode = BIOMARKER_GRAPH_NODES.find(n => n.id === selectedNodeId) || BIOMARKER_GRAPH_NODES[0];
  const activeNodeId = hoveredNodeId || selectedNodeId;

  // Find node position helper
  const getNodePos = (id) => {
    const node = BIOMARKER_GRAPH_NODES.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  // Connected nodes list for active node
  const connectedNodeIds = selectedNode.connectedTo || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Network className="w-3.5 h-3.5 text-emerald-600" /> BIOCHEMICAL KNOWLEDGE GRAPH
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Biomarker Interaction & Physiological Cascade Map
            </h2>
          </div>

          <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs font-semibold">
            Click any biomarker node to inspect biological cross-talk
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive SVG Graph + Correlation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: SVG Knowledge Graph Canvas (2 Cols) */}
        <div className="card-white p-6 bg-slate-950 rounded-3xl lg:col-span-2 relative overflow-hidden shadow-xl border-slate-800">
          
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">Interactive Metabolic Network</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Elevated / Deficient
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Borderline
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Optimal Target
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full overflow-x-auto py-2">
            <svg viewBox="0 0 680 460" className="w-full h-auto min-w-[550px] max-h-[480px]">
              
              {/* Background Grid Pattern */}
              <defs>
                <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="680" height="460" fill="url(#graph-grid)" />

              {/* Edge Connections */}
              {BIOCHEMICAL_INTERACTIONS.map((edge) => {
                const src = getNodePos(edge.source);
                const tgt = getNodePos(edge.target);
                const isEdgeActive = edge.source === activeNodeId || edge.target === activeNodeId;

                return (
                  <g key={edge.id}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={isEdgeActive ? '#10B981' : '#334155'}
                      strokeWidth={isEdgeActive ? '2.5' : '1.2'}
                      strokeDasharray={isEdgeActive ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />
                    {isEdgeActive && (
                      <circle
                        cx={(src.x + tgt.x) / 2}
                        cy={(src.y + tgt.y) / 2}
                        r="3"
                        fill="#34D399"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Biomarker Nodes */}
              {BIOMARKER_GRAPH_NODES.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isConnected = selectedNode.connectedTo?.includes(node.id);
                const isHighlighted = isSelected || isConnected;

                let nodeColor = '#10B981'; // Emerald
                let pulseColor = 'rgba(16, 185, 129, 0.4)';
                if (node.status === 'HIGH' || node.status === 'DEFICIENT') {
                  nodeColor = '#F43F5E'; // Rose
                  pulseColor = 'rgba(244, 63, 94, 0.4)';
                } else if (node.status === 'BORDERLINE') {
                  nodeColor = '#F59E0B'; // Amber
                  pulseColor = 'rgba(245, 158, 11, 0.4)';
                }

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Glowing outer halo if selected */}
                    {isHighlighted && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r + 8}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="2"
                        opacity={isSelected ? '0.8' : '0.4'}
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                      />
                    )}

                    {/* Main Node Bubble */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill="#0F172A"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      className="hover:brightness-125"
                    />

                    {/* Node Text Labels */}
                    <text
                      x={node.x}
                      y={node.y - 4}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {node.label.split(' ')[0]}
                    </text>

                    <text
                      x={node.x}
                      y={node.y + 10}
                      fill={nodeColor}
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {node.value}
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>

        </div>

        {/* Right: Selected Biomarker Correlation Inspector (1 Col) */}
        <div className="card-white p-6 space-y-5 border-l-4 border-l-brand-green-600 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-neutral text-[10px] uppercase font-bold">
                  {selectedNode.category} Axis
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  selectedNode.status === 'HIGH' || selectedNode.status === 'DEFICIENT'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : selectedNode.status === 'BORDERLINE'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                {selectedNode.label}
              </h3>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                Current Level: <span className="text-emerald-700">{selectedNode.value}</span>
              </div>
            </div>

            {/* Physiological Mechanism Description */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Biological Role & Mechanism:</strong>
              {selectedNode.description}
            </div>

            {/* Connected Biomarkers in this Cascade */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Biochemically Linked Parameters ({connectedNodeIds.length}):
              </span>

              <div className="space-y-1.5">
                {connectedNodeIds.map((targetId) => {
                  const targetNode = BIOMARKER_GRAPH_NODES.find(n => n.id === targetId);
                  const matchingInteraction = BIOCHEMICAL_INTERACTIONS.find(
                    i => (i.source === selectedNode.id && i.target === targetId) ||
                         (i.target === selectedNode.id && i.source === targetId)
                  );

                  if (!targetNode) return null;

                  return (
                    <div
                      key={targetId}
                      onClick={() => setSelectedNodeId(targetId)}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-green-300 hover:bg-emerald-50/30 transition-all cursor-pointer text-xs space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 font-bold">{targetNode.label}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold">{targetNode.value}</span>
                      </div>
                      {matchingInteraction && (
                        <p className="text-[11px] text-slate-600">
                          {matchingInteraction.relationship}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clinician Insight Tip */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
            💡 <strong className="text-emerald-900">Multimodal Strategy:</strong> Addressing high-impact root nodes (e.g. normalizing Vitamin D and TSH) creates a positive downstream cascade, lowering both LDL and fasting blood sugar.
          </div>

        </div>

      </div>

    </div>
  );
}
