import React, { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { addFeedback, getFeedbacks } from '../data/storage';
import { Feedback } from '../types';

interface FeedbackCardProps {
  batchId: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ batchId }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => getFeedbacks(batchId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    const newFb = addFeedback(batchId, rating, comment.trim());
    setFeedbacks([newFb, ...feedbacks]);
    setComment('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Gửi phản hồi chất lượng
          </h3>
          <p className="text-xs text-slate-500">
            Ý kiến của bạn giúp chúng tôi cải thiện chuỗi cung ứng sữa tươi
          </p>
        </div>
      </div>

      {isSubmitted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cảm ơn bạn! Phản hồi đã được ghi nhận trên thiết bị của bạn.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Đánh giá cảm nhận độ tươi mới (1 – 5 sao)
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating !== null ? hoverRating : rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  aria-label={`Đánh giá ${star} sao`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      active
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-semibold text-slate-600 ml-2">
              {rating}/5 sao
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="fb-comment" className="block text-xs font-medium text-slate-700 mb-1">
            Ghi chú thêm (không bắt buộc)
          </label>
          <textarea
            id="fb-comment"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ví dụ: Sữa rất thơm ngon, bao bì còn nguyên lạnh..."
            className="w-full text-sm p-3 rounded-xl border border-[#ebe7dd] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none bg-[#fcfaf5]"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Gửi đánh giá</span>
        </button>
      </form>

      {/* Recent feedback list if any */}
      {feedbacks.length > 0 && (
        <div className="pt-3 border-t border-[#f0ece1] space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Đánh giá đã gửi gần đây ({feedbacks.length})
          </p>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="text-xs p-2.5 rounded-lg bg-[#fcfaf5] border border-[#ede9df]">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px]">
                    {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {fb.comment && <p className="text-slate-700">{fb.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
