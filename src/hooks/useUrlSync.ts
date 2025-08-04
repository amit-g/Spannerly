import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedCategory, setSearchQuery } from '@/store/toolsSlice';
import { ToolCategory } from '@/types';

/**
 * Custom hook to synchronize URL query parameters with Redux state
 * Implements the hybrid approach for URL routing
 */
export const useUrlSync = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery } = useAppSelector((state: any) => state.tools);

  // Parse query parameters on initial load and route changes
  useEffect(() => {
    if (!router.isReady) return;

    const { category, search, subcategory } = router.query;

    // Sync category from URL to Redux
    if (category && typeof category === 'string') {
      const categoryValue = category.toUpperCase().replace('-', '_') as ToolCategory;
      if (Object.values(ToolCategory).includes(categoryValue)) {
        dispatch(setSelectedCategory(categoryValue));
      }
    } else if (!category && selectedCategory) {
      // Clear category if not in URL
      dispatch(setSelectedCategory(null));
    }

    // Sync search query from URL to Redux
    if (search && typeof search === 'string') {
      dispatch(setSearchQuery(search));
    } else if (!search && searchQuery) {
      // Clear search if not in URL
      dispatch(setSearchQuery(''));
    }
  }, [router.isReady, router.query, dispatch]);

  // Update URL when Redux state changes
  useEffect(() => {
    if (!router.isReady) return;

    const currentQuery = { ...router.query };
    let shouldUpdate = false;

    // Update category in URL
    const categoryParam = selectedCategory?.toLowerCase().replace('_', '-');
    if (categoryParam && currentQuery.category !== categoryParam) {
      currentQuery.category = categoryParam;
      shouldUpdate = true;
    } else if (!categoryParam && currentQuery.category) {
      delete currentQuery.category;
      shouldUpdate = true;
    }

    // Update search query in URL
    if (searchQuery && currentQuery.search !== searchQuery) {
      currentQuery.search = searchQuery;
      shouldUpdate = true;
    } else if (!searchQuery && currentQuery.search) {
      delete currentQuery.search;
      shouldUpdate = true;
    }

    // Update URL if needed
    if (shouldUpdate) {
      router.replace(
        {
          pathname: router.pathname,
          query: currentQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [selectedCategory, searchQuery, router]);

  return {
    // Utility functions for manual URL updates
    updateCategory: (category: ToolCategory | null) => {
      dispatch(setSelectedCategory(category));
    },
    updateSearch: (search: string) => {
      dispatch(setSearchQuery(search));
    },
    clearFilters: () => {
      dispatch(setSelectedCategory(null));
      dispatch(setSearchQuery(''));
    },
  };
};

/**
 * Hook for tool-specific URL management
 * Handles opening/closing tools and maintaining tool state in URL
 */
export const useToolUrl = () => {
  const router = useRouter();

  const openTool = (toolId: string, asPage = false) => {
    if (asPage) {
      // Navigate to dedicated tool page
      router.push(`/tools/${toolId}`);
    } else {
      // Open as modal with query parameter
      const currentQuery = { ...router.query };
      currentQuery.tool = toolId;
      
      router.replace(
        {
          pathname: router.pathname,
          query: currentQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const closeTool = () => {
    const currentQuery = { ...router.query };
    delete currentQuery.tool;
    
    router.replace(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const getToolFromUrl = (): string | null => {
    const { tool } = router.query;
    return typeof tool === 'string' ? tool : null;
  };

  return {
    openTool,
    closeTool,
    getToolFromUrl,
    isToolPage: router.pathname.startsWith('/tools/'),
    currentToolId: router.pathname.startsWith('/tools/') 
      ? router.query.toolId as string 
      : getToolFromUrl(),
  };
};

/**
 * Hook to get shareable URLs for current state
 */
export const useShareableUrl = () => {
  const router = useRouter();
  const { selectedCategory, searchQuery } = useAppSelector((state: any) => state.tools);

  const getCurrentUrl = (): string => {
    if (typeof window === 'undefined') return '';
    
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set('category', selectedCategory.toLowerCase().replace('_', '-'));
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }

    // Add current tool if open
    const { tool } = router.query;
    if (tool && typeof tool === 'string') {
      params.set('tool', tool);
    }

    url.search = params.toString();
    return url.toString();
  };

  const getToolUrl = (toolId: string, asPage = false): string => {
    if (typeof window === 'undefined') return '';
    
    const url = new URL(window.location.href);
    
    if (asPage) {
      url.pathname = `/tools/${toolId}`;
      url.search = '';
    } else {
      const params = new URLSearchParams(url.search);
      params.set('tool', toolId);
      url.search = params.toString();
    }
    
    return url.toString();
  };

  return {
    getCurrentUrl,
    getToolUrl,
  };
};
