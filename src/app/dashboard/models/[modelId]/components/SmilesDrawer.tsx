'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface SmilesDrawerProps {
  height?: string;
  width?: string;
  smiles?: string;
  onChange?: (smiles: string) => void;
}

// Client-side only Ketcher component
function KetcherComponent({
  height = '450px',
  width = '500px',
  smiles = '',
  onChange,
}: SmilesDrawerProps) {
  const [structServiceProvider, setStructServiceProvider] = useState<any>(null);
  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const [ketcher, setKetcher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSmiles, setCurrentSmiles] = useState<string>('');
  const cleanupRef = useRef<(() => void)[]>([]);


  useEffect(() => {
    const initKetcher = async () => {
      try {

        // Dynamic imports for client-side only - import both modules
        const [ketcherStandalone, ketcherReact] = await Promise.all([
          import('ketcher-standalone'),
          import('ketcher-react'),
        ]);

        // Import styles separately
        try {
          await import('ketcher-react/dist/index.css');
        } catch (styleError) {
          // Styles failed to load, continue without them
        }

        const provider =
          new ketcherStandalone.StandaloneStructServiceProvider();

        setEditorComponent(() => ketcherReact.Editor);
        setStructServiceProvider(provider);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    void initKetcher();
  }, []);

  const handleInit = (ketcherInstance: any) => {
    // Clean up any existing listeners before setting up new ones
    cleanupRef.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        // Ignore cleanup errors
      }
    });
    cleanupRef.current = [];

    (window as any).ketcher = ketcherInstance;
    setKetcher(ketcherInstance);

    // Set initial SMILES if provided
    if (smiles) {
      const smilesTimeout = setTimeout(() => {
        try {
          void ketcherInstance.setMolecule(smiles);
        } catch (error) {
          // Error setting initial SMILES, ignore
        }
      }, 500);
      cleanupRef.current.push(() => clearTimeout(smilesTimeout));
    }

    // Set up change detection
    if (onChange) {
      // Call onChange immediately with current state
      const initialTimeout = setTimeout(() => {
        try {
          ketcherInstance
            .getSmiles()
            .then((smilesString: string) => {
              setCurrentSmiles(smilesString || '');
              onChange(smilesString || '');
            })
            .catch(() => {
              setCurrentSmiles('');
            });
        } catch (syncError) {
          setCurrentSmiles('');
        }
      }, 1000);

      // Set up change detection
      let lastSmiles = '';
      const handleStructureChange = () => {
        try {
          ketcherInstance
            .getSmiles()
            .then((smilesString: string) => {
              if (smilesString !== lastSmiles) {
                lastSmiles = smilesString || '';
                setCurrentSmiles(smilesString || '');
                onChange(smilesString || '');
              }
            })
            .catch(() => {
              // Error getting SMILES, ignore
            });
        } catch (syncError) {
          // Sync error, ignore
        }
      };

      const debouncedChange = debounce(handleStructureChange, 500);

      // Set up event listeners
      const eventTimeout = setTimeout(() => {
        const selectors = [
          '.ketcher-root',
          '[class*="ketcher"]',
          'canvas',
          '.canvas',
        ];

        let ketcherContainer = null;
        for (const selector of selectors) {
          ketcherContainer = document.querySelector(selector);
          if (ketcherContainer) {
            break;
          }
        }

        if (ketcherContainer) {
          ketcherContainer.addEventListener('mouseup', debouncedChange);
          // Store cleanup function
          cleanupRef.current.push(() => {
            ketcherContainer.removeEventListener('mouseup', debouncedChange);
          });
        } else {
          document.addEventListener('mouseup', debouncedChange);
          // Store cleanup function
          cleanupRef.current.push(() => {
            document.removeEventListener('mouseup', debouncedChange);
          });
        }
      }, 1500);

      // Store cleanup function for timeouts
      cleanupRef.current.push(
        () => clearTimeout(initialTimeout),
        () => clearTimeout(eventTimeout)
      );
    }
  };

  // Update SMILES when prop changes
  useEffect(() => {
    if (ketcher && smiles) {
      try {
        void ketcher.setMolecule(smiles);
      } catch (error) {
        // Error updating SMILES, ignore
      }
    }
  }, [smiles, ketcher]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up all event listeners and timeouts when component unmounts
      cleanupRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          // Ignore cleanup errors
        }
      });
      cleanupRef.current = [];
    };
  }, []);

  if (isLoading) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center rounded border border-gray-300"
      >
        <div>Loading molecular editor...</div>
      </div>
    );
  }

  if (!structServiceProvider || !EditorComponent) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center rounded border border-gray-300"
      >
        <div>Failed to load molecular editor</div>
      </div>
    );
  }


  return (
    <div>
      <div style={{ width, height }}>
        <EditorComponent
          staticResourcesUrl=""
          structServiceProvider={structServiceProvider}
          onInit={handleInit}
          errorHandler={() => {
            // Handle errors silently
          }}
        />
      </div>
      <div className="mt-4 rounded bg-gray-100 p-3 dark:bg-gray-700">
        <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Generated SMILES:
        </p>
        <p className="break-all font-mono text-xs text-gray-600 dark:text-gray-400">
          {currentSmiles || '(empty - draw a molecule above)'}
        </p>
      </div>
    </div>
  );
}

// Dynamic import with SSR disabled
const DynamicKetcherComponent = dynamic(
  () => Promise.resolve(KetcherComponent),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded border border-gray-300"
        style={{ width: '500px', height: '450px' }}
      >
        <div>Loading molecular editor...</div>
      </div>
    ),
  },
);

export default function SmilesDrawer(props: SmilesDrawerProps) {
  return <DynamicKetcherComponent {...props} />;
}
