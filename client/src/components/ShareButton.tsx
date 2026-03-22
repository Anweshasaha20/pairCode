import React, { useState } from "react";

interface ShareButtonProps {
  roomId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleEmailShare = () => {
    const shareableLink = `${window.location.origin}/room/${roomId}`;
    const subject = encodeURIComponent("Join my Collaborative Code Editor Room");
    const body = encodeURIComponent(
      `Hi,\n\nI would like to invite you to collaborate on a code editor room. Click the link below to join:\n\n${shareableLink}\n\nBest regards,`
    );
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="text-xs px-3 py-1.5 rounded-md border font-medium transition-all"
        style={{
          background: copied ? "#238636" : "#21262d",
          color: copied ? "#ffffff" : "#e6edf3",
          borderColor: "#30363d",
        }}
      >
        {copied ? "✓ Link Copied" : "Copy Link"}
      </button>
      <button
        onClick={handleEmailShare}
        className="text-xs px-3 py-1.5 rounded-md font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #1f6feb, #6e40c9)" }}
      >
        Share via Gmail
      </button>
    </div>
  );
};

export default ShareButton;