import { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorldContext } from '../contexts/WorldContext';
import { calculateReverseLinks, groupReverseLinks } from '../utils/reverseLinks';
import type { Element } from '../types/world';

interface ReverseLinkSectionProps {
  elementId: string;
  className?: string;
}

export const ReverseLinkSection = memo(function ReverseLinkSection({ elementId, className = '' }: ReverseLinkSectionProps) {
  const { elements } = useWorldContext();
  const navigate = useNavigate();
  
  // Calculate reverse links with memoization
  const reverseLinks = useMemo(() => {
    return calculateReverseLinks(elementId, elements);
  }, [elementId, elements]);
  
  // Group by friendly labels
  const groupedLinks = useMemo(() => {
    return groupReverseLinks(reverseLinks);
  }, [reverseLinks]);
  
  // Don't render if no reverse links
  if (groupedLinks.size === 0) {
    return null;
  }
  
  const handleElementClick = (element: Element) => {
    navigate(`/element/${element.id}`);
  };
  
  return (
    <div className={`bg-sand-100 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">references</h3>
      
      <div className="space-y-4">
        {Array.from(groupedLinks.entries()).map(([label, group]) => (
          <div key={label} className="bg-sand-50 rounded-lg p-4 border border-sand-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {label} ({group.elements.length})
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {group.elements.map(element => (
                <button
                  key={element.id}
                  onClick={() => handleElementClick(element)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <span className="text-xs text-blue-500 mr-1">
                    {element.category?.charAt(0).toUpperCase()}
                  </span>
                  {element.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});