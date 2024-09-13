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

export default function SmilesDrawer() {
  return (
    <iframe
      id="sketch"
      src="/marvinjs/editor.html"
      style={{
        overflow: 'hidden',
        minWidth: '500px',
        minHeight: '450px',
        border: '1px solid darkgray',
      }}
    />
  );
}
