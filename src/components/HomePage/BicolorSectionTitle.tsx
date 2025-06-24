
import React from 'react';

interface BicolorSectionTitleProps {
  title?: string;
  titlePart1?: string;
  titlePart2?: string;
  titleColor1?: string;
  titleColor2?: string;
  className?: string;
}

const BicolorSectionTitle: React.FC<BicolorSectionTitleProps> = ({
  title,
  titlePart1,
  titlePart2,
  titleColor1 = '#000000',
  titleColor2 = '#9ca3af',
  className = ''
}) => {
  // If we have bicolor parts, use them; otherwise fall back to regular title
  if (titlePart1 || titlePart2) {
    return (
      <h2 className={`text-xl md:text-2xl font-bold mb-4 ${className}`}>
        {titlePart1 && (
          <span style={{ color: titleColor1 }}>{titlePart1}</span>
        )}
        {titlePart1 && titlePart2 && ' '}
        {titlePart2 && (
          <span style={{ color: titleColor2 }}>{titlePart2}</span>
        )}
      </h2>
    );
  }

  // Fallback to regular title
  if (title) {
    return (
      <h2 className={`text-xl md:text-2xl font-bold mb-4 ${className}`}>
        {title}
      </h2>
    );
  }

  return null;
};

export default BicolorSectionTitle;
