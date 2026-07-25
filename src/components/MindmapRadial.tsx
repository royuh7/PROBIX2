import React, { useState } from 'react';
import { MindmapNode, CategoryType } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Target, HelpCircle, Lightbulb, Compass, Zap } from 'lucide-react';

interface Props {
  problemTitle: string;
  category: CategoryType;
  nodes: MindmapNode[];
  keywords: string[];
}

export const MindmapRadial: React.FC<Props> = ({
  problemTitle,
  category,
  nodes,
  keywords,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Map types to icons & colors
  const getTypeMeta = (type: string) => {
    switch (type) {
      case 'target':
        return { label: '주요 대상 (누가)', icon: Target, bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', badge: 'bg-indigo-500' };
      case 'context':
        return { label: '발생 환경 (언제/어디서)', icon: Compass, bg: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-500' };
      case 'solution':
        return { label: '현재 대응 방식', icon: HelpCircle, bg: 'bg-rose-50 border-rose-200 text-rose-700', badge: 'bg-rose-500' };
      case 'ideal':
        return { label: '이상적 해결 목표', icon: Lightbulb, bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', badge: 'bg-emerald-500' };
      default:
        return { label: '핵심 동인 및 키워드', icon: Zap, bg: 'bg-blue-50 border-blue-200 text-blue-700', badge: 'bg-blue-500' };
    }
  };

  // Coordinates for 5 or 6 radial nodes around (50%, 50%) center
  // Relative percentage coordinates (x%, y%)
  const nodePositions = [
    { x: 18, y: 18 },  // Top-Left
    { x: 82, y: 18 },  // Top-Right
    { x: 90, y: 50 },  // Mid-Right
    { x: 80, y: 82 },  // Bottom-Right
    { x: 20, y: 82 },  // Bottom-Left
    { x: 10, y: 50 },  // Mid-Left
  ];

  return (
    <div className="space-y-6">
      {/* Visual Radial Diagram Canvas Container */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

        {/* SVG Connecting Branch Lines Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {nodes.map((node, index) => {
            const pos = nodePositions[index % nodePositions.length];
            const isSelected = selectedNodeId === node.id;
            return (
              <g key={`line-${node.id}`}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${pos.x}%`}
                  y2={`${pos.y}%`}
                  stroke={isSelected ? '#3b82f6' : '#475569'}
                  strokeWidth={isSelected ? '3' : '1.5'}
                  strokeDasharray={isSelected ? 'none' : '4 4'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Central Core Problem Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-40 sm:w-52 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/50 shadow-2xl shadow-blue-500/20 text-center flex flex-col items-center justify-center cursor-default">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-900/60 px-2 py-0.5 rounded-md mb-1 border border-blue-400/30">
            핵심 문제 (중앙)
          </span>
          <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight line-clamp-2">
            {problemTitle}
          </h4>
        </div>

        {/* Outer Branching Radial Nodes */}
        <div className="relative z-10 w-full h-full min-h-[320px] sm:min-h-[360px]">
          {nodes.map((node, index) => {
            const pos = nodePositions[index % nodePositions.length];
            const isSelected = selectedNodeId === node.id;
            const meta = getTypeMeta(node.type);
            const Icon = meta.icon;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 text-left w-32 sm:w-44 shadow-lg cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-blue-500 ring-2 ring-blue-500/50 scale-105 z-20'
                    : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 hover:scale-102 z-10'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`p-1 rounded-md text-white ${meta.badge}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300 truncate">
                    {node.label}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-tight">
                  {node.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Bottom Helper Instruction */}
        <div className="relative z-10 text-center text-slate-400 text-[11px] pt-2 border-t border-slate-800/80">
          💡 노드를 클릭하면 하단에서 상세 문제 분석과 연관 키워드를 자세히 확인할 수 있습니다.
        </div>
      </div>

      {/* Selected Node Details Card & Keywords */}
      {selectedNode && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getTypeMeta(selectedNode.type).bg}`}>
                {getTypeMeta(selectedNode.type).label}
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {selectedNode.label}
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">ID: {selectedNode.id}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {selectedNode.description}
          </p>

          {/* Extracted Hashtags */}
          <div>
            <h5 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              추출된 핵심 해시태그 키워드
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-lg"
                >
                  #{kw.replace(/^#/, '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
