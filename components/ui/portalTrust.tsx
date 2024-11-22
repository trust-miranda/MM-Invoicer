import React from "react";

interface EmbedWebsiteProps {
  url: string;
}

export const EmbedWebsite: React.FC<EmbedWebsiteProps> = ({ url }) => {
  return (
    <div className="embed-website">
      <iframe
        src={url}
        title="Portal TRUST"
        className="w-full h-full border-none"
        allowFullScreen
      />
    </div>
  );
};
