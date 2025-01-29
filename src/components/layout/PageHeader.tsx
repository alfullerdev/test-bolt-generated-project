import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold gradient-text mb-4">{title}</h1>
      {description && (
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

export default PageHeader;
