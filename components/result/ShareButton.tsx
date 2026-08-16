import { Share2, MessageCircle, Send, Link } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  score: number;
  occasion?: string | null;
}

export default function ShareButton({ score, occasion }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just got a ${score}% Style DNA match${occasion ? ` for ${occasion}` : ''} on StyleLens! 🎯✨ Try it yourself!`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://styledna.ai";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, "_blank", "width=550,height=420");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Share2 className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Share Your Results</h3>
          <p className="text-sm text-slate-600">Show off your perfect match!</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTwitterShare}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <Send size={16} />
          Twitter
        </button>

        <button
          onClick={handleFacebookShare}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <MessageCircle size={16} />
          Facebook
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <Link size={16} />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
