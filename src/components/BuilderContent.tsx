/**
 * Builder.io Content Component
 * Renders Builder.io content and enables visual editing
 */
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Import the component registry to ensure components are registered
import '../builder-registry';

// Initialize Builder with the API key from environment variables
builder.init(import.meta.env.VITE_BUILDER_IO_KEY);

interface BuilderContentProps {
  modelName?: string;
  content?: any;
  locationPathname?: string;
}

export const BuilderContent: React.FC<BuilderContentProps> = ({
  modelName = 'page',
  content: initialContent,
  locationPathname,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const location = useLocation();
  const isPreviewing = useIsPreviewing();

  // Set path from router or window location for SSR/CSR compatibility
  useEffect(() => {
    if (locationPathname) {
      setCurrentPath(locationPathname);
    } else if (location?.pathname) {
      setCurrentPath(location.pathname);
    } else if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, [locationPathname, location?.pathname]);

  // Fetch content if not provided
  useEffect(() => {
    if (!initialContent) {
      const fetchContent = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const builderContent = await builder
            .get(modelName, {
              url: currentPath,
              userAttributes: {
                // Add any user attributes for targeting
                device: 'desktop',
                urlPath: currentPath,
              },
            })
            .promise();
          
          setContent(builderContent);
        } catch (err) {
          console.error('Error fetching Builder content:', err);
          setError('Failed to load content from Builder.io');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchContent();
    }
  }, [initialContent, modelName, currentPath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Path: {currentPath}
          </p>
        </div>
      </div>
    );
  }

  if (!content && !isPreviewing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No content found for this page</p>
          <p className="text-sm text-gray-500 mt-2">
            Create content in Builder.io for: {currentPath}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Model: {modelName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BuilderComponent 
      model={modelName} 
      content={content} 
      options={{ includeRefs: true }}
    />
  );
};

export default BuilderContent;
