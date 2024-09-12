'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SmilesDrawerModalProps {
  height: number;
  width: number;
  smiles?: string;
  options?: any;
  onChange?: (smiles: string) => void;
  src?: string;
}

export default function SmilesDrawer({
  height,
  width,
  smiles,
  options,
  onChange,
  src,
}: SmilesDrawerModalProps) {
  const Window = window && (window as any);
  const [jsmeIsLoaded, setJsmeIsLoaded] = useState(false);
  const jsmeApplet: any = useRef(null);
  const CONTAINER_ID = 'jsme_container';

  // Function to load the JSME script
  const setup = useCallback(
    (src = 'https://jsme-editor.github.io/dist/jsme/jsme.nocache.js') => {
      const script = document.createElement('script');
      script.src = src;

      Window.jsmeOnLoad = () => {
        setJsmeIsLoaded(true);
      };

      document.head.appendChild(script);
    },
    [height, width, options, smiles],
  );

  // Function to handle the JSME applet load
  const handleJsmeLoad = useCallback(() => {
    if (options) {
      jsmeApplet.current = new Window.JSApplet.JSME(
        CONTAINER_ID,
        `${width}px`,
        `${height}px`,
        {
          options,
        },
      );
    } else {
      jsmeApplet.current = new Window.JSApplet.JSME(
        CONTAINER_ID,
        `${width}px`,
        `${height}px`,
      );
    }
    jsmeApplet.current.setCallBack('AfterStructureModified', handleChange);
    if (smiles) {
      jsmeApplet.current.readGenericMolecularInput(smiles);
    }
  }, [height, width, options, smiles]);

  // Function to handle changes in the JSME applet
  const handleChange = useCallback(
    (jsmeEvent: any) => {
      if (onChange) {
        onChange(jsmeEvent.src.smiles());
      }
    },
    [onChange],
  );

  // Effect to handle component mount and update
  useEffect(() => {
    if (jsmeIsLoaded) {
      handleJsmeLoad();
    } else {
      if (!Window.jsmeOnLoad) {
        setup(src);
      }
    }
  }, [jsmeIsLoaded, handleJsmeLoad, src]);

  // Effect to handle updates to props
  useEffect(() => {
    if (jsmeApplet.current) {
      if (height || width) {
        jsmeApplet.current.setSize(width, height);
      }
      if (options) {
        jsmeApplet.current.options({ options });
      }
      if (smiles) {
        jsmeApplet.current.readGenericMolecularInput(smiles);
      }
    }
  }, [height, width, options, smiles]);

  return <div id="jsme_container"></div>;
}
