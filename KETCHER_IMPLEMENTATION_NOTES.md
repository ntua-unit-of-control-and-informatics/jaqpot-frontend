# Ketcher SMILES Drawer Implementation Notes

## Problem
The existing JSME-based SmilesDrawer component in `SmilesInput.tsx` was showing an empty modal instead of a molecular editor. Need to replace with Ketcher for drawing molecular structures.

## Solution Progress

### 1. Initial Attempt - Static Imports
- Replaced JSME with direct Ketcher imports
- **Issue**: "Worker is not defined" and "Ketcher needs to be initialized before KetcherLogger is used" errors
- **Cause**: SSR issues with Ketcher trying to use browser-only APIs

### 2. Dynamic Import Attempt  
- Used Next.js `dynamic()` with `ssr: false`
- **Issue**: "X is not a function" error from react-contexify dependency
- **Cause**: Complex dependency chain still causing import issues

### 3. Current Approach - Separate Wrapper Component
Created `KetcherWrapper.tsx` with:
- Pure dynamic imports inside useEffect
- Direct Editor.init() approach instead of React component
- Polling + event-based change detection
- Better error handling and cleanup

## Key Files Modified
- `src/app/dashboard/models/[modelId]/components/SmilesDrawer.tsx` - Main dynamic wrapper
- `src/app/dashboard/models/[modelId]/components/KetcherWrapper.tsx` - Alternative implementation
- `src/app/dashboard/models/[modelId]/components/SmilesInput.tsx` - Modal that uses SmilesDrawer

## Packages Installed
```bash
npm install ketcher-react ketcher-core ketcher-standalone
```

## Current Status
- SmilesDrawer component uses dynamic import with SSR disabled
- KetcherWrapper created as alternative approach using Editor.init()
- Modal styling fixed (removed dark theme overrides)
- onChange callback properly wired to enable "Use This Structure" button

## Next Steps
1. Test KetcherWrapper approach if current implementation still has issues
2. Consider using React.lazy() as alternative to Next.js dynamic()
3. May need to create custom Ketcher integration without react-contexify dependency

## Key Learnings
- Ketcher has complex SSR issues requiring client-side only loading
- The react-contexify dependency in ketcher-react can cause "X is not a function" errors
- Direct Editor.init() approach may be more reliable than React component wrapper
- Change detection needs both polling and event listeners for reliability