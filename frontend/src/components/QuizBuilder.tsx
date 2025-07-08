import React from 'react';

export type QuizQuestion = {
  type: 'MCQ' | 'ShortAnswer';
  text: string;
  options?: string[];
  correctAnswer: string;
  points: number;
};
// ESM import workaround: export a dummy variable
export const QuizQuestion = null;

interface QuizBuilderProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

const defaultMCQ = (): QuizQuestion => ({
  type: 'MCQ',
  text: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  points: 1,
});

const defaultShort = (): QuizQuestion => ({
  type: 'ShortAnswer',
  text: '',
  correctAnswer: '',
  points: 1,
});

const QuizBuilder: React.FC<QuizBuilderProps> = ({ questions, onChange }) => {
  const addQuestion = (type: 'MCQ' | 'ShortAnswer') => {
    onChange([...questions, type === 'MCQ' ? defaultMCQ() : defaultShort()]);
  };

  const updateQuestion = (idx: number, field: keyof QuizQuestion, value: any) => {
    const updated = questions.map((q, i) => i === idx ? { ...q, [field]: value } : q);
    onChange(updated);
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    const updated = questions.map((q, i) => {
      if (i !== qIdx || !q.options) return q;
      const options = q.options.map((o, oi) => oi === optIdx ? value : o);
      return { ...q, options };
    });
    onChange(updated);
  };

  const setCorrect = (qIdx: number, value: string) => {
    const updated = questions.map((q, i) => i === qIdx ? { ...q, correctAnswer: value } : q);
    onChange(updated);
  };

  const setPoints = (qIdx: number, value: number) => {
    const updated = questions.map((q, i) => i === qIdx ? { ...q, points: value } : q);
    onChange(updated);
  };

  const removeQuestion = (idx: number) => {
    onChange(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button type="button" onClick={() => addQuestion('MCQ')} className="bg-blue-600 text-white px-3 py-1 rounded">+ MCQ</button>
        <button type="button" onClick={() => addQuestion('ShortAnswer')} className="bg-blue-500 text-white px-3 py-1 rounded">+ Short Answer</button>
      </div>
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-white rounded-lg shadow p-4 mb-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-blue-600">Q{qIdx + 1}:</span>
            <select value={q.type} onChange={e => updateQuestion(qIdx, 'type', e.target.value as 'MCQ' | 'ShortAnswer')} className="border rounded px-2 py-1">
              <option value="MCQ">MCQ</option>
              <option value="ShortAnswer">Short Answer</option>
            </select>
            <input
              type="number"
              min={1}
              value={q.points}
              onChange={e => setPoints(qIdx, Number(e.target.value))}
              className="w-16 border rounded px-2 py-1 ml-2"
              placeholder="Points"
            />
            <button type="button" className="text-red-500 ml-2" onClick={() => removeQuestion(qIdx)}>Remove</button>
          </div>
          <input
            type="text"
            value={q.text}
            onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
            placeholder="Enter question text"
            className="w-full border-b-2 border-blue-200 focus:border-blue-500 outline-none px-2 py-1 text-gray-800 bg-blue-50 rounded mb-2"
          />
          {q.type === 'MCQ' && q.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correctAnswer === opt}
                    onChange={() => setCorrect(qIdx, opt)}
                    className="accent-blue-600"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                    placeholder={`Option ${optIdx + 1}`}
                    className="flex-1 border-b border-blue-100 focus:border-blue-500 outline-none px-2 py-1 text-gray-700 bg-blue-50 rounded"
                  />
                  {q.correctAnswer === opt && (
                    <span className="text-green-600 text-xs font-semibold ml-1">Correct</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {q.type === 'ShortAnswer' && (
            <div className="mt-2">
              <input
                type="text"
                value={q.correctAnswer}
                onChange={e => setCorrect(qIdx, e.target.value)}
                placeholder="Correct answer (case-insensitive)"
                className="w-full border-b border-blue-100 focus:border-blue-500 outline-none px-2 py-1 text-gray-700 bg-blue-50 rounded"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizBuilder; 