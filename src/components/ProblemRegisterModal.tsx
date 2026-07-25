import React, { useState } from 'react';
import { CategoryType, Problem } from '../types';
import { CATEGORY_INFO } from '../data/sampleProblems';
import { X, Plus, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (newProblem: Problem) => void;
}

export const ProblemRegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const categories = Object.keys(CATEGORY_INFO) as CategoryType[];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('교육');
  const [frequency, setFrequency] = useState('매일');
  const [severity, setSeverity] = useState<number>(80);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProblem: Problem = {
      id: `p-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      source: '사용자 입력',
      upvotes: 1,
      frequency,
      severity,
      createdAt: new Date().toISOString().split('T')[0],
      authorName: '나 (신규 참가자)',
    };

    onRegister(newProblem);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setDescription('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">문제가 성공적으로 등록되었습니다!</h3>
            <p className="text-sm text-slate-600">이제 다른 사용자와 AI가 함께 이 문제를 탐구할 수 있습니다.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                PROBIX 문제 발견
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">새로운 불편 및 문제 등록</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                아이디어를 내기 전에 일상이나 분야에서 경험한 문제를 상세히 적어주세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  관련 카테고리 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  문제 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 수행평가 주제를 정하는 데 어려움을 겪고 있다."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  문제 상세 설명 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="언제, 누구에게, 왜 이러한 불편이나 문제가 발생하는지 상세히 설명해주세요."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Frequency & Severity Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    발생 빈도
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="매일">매일 발생</option>
                    <option value="주 2~3회">주 2~3회</option>
                    <option value="프로젝트/학기마다">프로젝트/학기마다</option>
                    <option value="특정 계절/환경">특정 계절/환경</option>
                    <option value="상시">상시 발생</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      심각도 (1~100점) <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-xs font-extrabold text-amber-600">{severity}점</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={severity || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (isNaN(val)) setSeverity(0);
                        else setSeverity(Math.min(100, Math.max(1, val)));
                      }}
                      placeholder="숫자 직접 입력 (1~100)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <span className="text-xs font-bold text-slate-500 shrink-0">점</span>
                  </div>
                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {[30, 50, 70, 85, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSeverity(preset)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          severity === preset
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {preset}점
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  문제 등록하기
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
