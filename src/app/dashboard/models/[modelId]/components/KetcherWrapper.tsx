'use client';

import React, { useEffect, useState, useRef } from 'react';
import { logger } from '@/logger';

interface KetcherWrapperProps {
  height?: string;
  width?: string;
  smiles?: string;
  onChange?: (smiles: string) => void;
}

const log = logger.child({ module: 'KetcherWrapper' });

export default function KetcherWrapper({
  height = '450px',
  width = '500px',
  smiles = '',
  onChange,
}: KetcherWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSmiles, setCurrentSmiles] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const ketcherRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadKetcher = async () => {
      if (!containerRef.current) return;

      try {
        // Dynamic imports with type assertions to work around module resolution issues
        const [ketcherStandalone, ketcherReact] = await Promise.all([
          // @ts-ignore
          import('ketcher-standalone'),
          // @ts-ignore
          import('ketcher-react'),
        ]);

        const { StandaloneStructServiceProvider } = ketcherStandalone;
        const { Editor } = ketcherReact;

        if (!mounted) return;

        const structServiceProvider = new StandaloneStructServiceProvider();

        // @ts-ignore
        const editor = new Editor({
          staticResourcesUrl: '',
          structServiceProvider,
        });

        await editor.init(containerRef.current);

        if (!mounted) return;

        ketcherRef.current = editor;
        setIsLoaded(true);

        // Set initial SMILES if provided
        if (smiles) {
          setTimeout(() => {
            try {
              editor.setMolecule(smiles);
            } catch (err) {
              log.error('Error setting initial SMILES:', err);
            }
          }, 1000);
        }

        // Set up change detection
        if (onChange) {
          const checkForChanges = () => {
            try {
              editor
                .getSmiles()
                .then((smilesString: string) => {
                  if (smilesString !== currentSmiles) {
                    setCurrentSmiles(smilesString || '');
                    onChange(smilesString || '');
                  }
                })
                .catch((err: any) => {
                  log.error('Error getting SMILES:', err);
                });
            } catch (err) {
              log.error('Error in checkForChanges:', err);
            }
          };

          // Set up periodic checking and event listeners
          const interval = setInterval(checkForChanges, 1000);

          // Also check on mouse events
          const handleMouseUp = () => {
            setTimeout(checkForChanges, 100);
          };

          document.addEventListener('mouseup', handleMouseUp);

          // Cleanup function
          return () => {
            clearInterval(interval);
            document.removeEventListener('mouseup', handleMouseUp);
          };
        }
      } catch (err) {
        log.error('Failed to load Ketcher:', err);
        if (mounted) {
          setError('Failed to load molecular editor');
        }
      }
    };

    loadKetcher();

    return () => {
      mounted = false;
      if (ketcherRef.current) {
        try {
          ketcherRef.current.destroy?.();
        } catch (err) {
          log.error('Error destroying Ketcher:', err);
        }
      }
    };
  }, []);

  // Update SMILES when prop changes
  useEffect(() => {
    if (ketcherRef.current && smiles && isLoaded) {
      try {
        ketcherRef.current.setMolecule(smiles);
      } catch (err) {
        log.error('Error updating SMILES:', err);
      }
    }
  }, [smiles, isLoaded]);

  if (error) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center rounded border border-gray-300"
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center rounded border border-gray-300"
      >
        <div>Loading molecular editor...</div>
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        style={{ width, height }}
        className="rounded border border-gray-300"
      />
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
