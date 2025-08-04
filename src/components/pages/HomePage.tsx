import React, { useState, useEffect } from 'react';
import { Container, Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, Button, Chip, Stack } from '@mui/material';
import { Close, Construction, Share, OpenInNew, Fullscreen } from '@mui/icons-material';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { ToolGrid } from '@/components/common/ToolGrid';
import { useUrlSync, useToolUrl, useShareableUrl } from '@/hooks/useUrlSync';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/router';
import { CaseConverter } from '@/components/tools/CaseConverter';
import { Base64Converter } from '@/components/tools/Base64Converter';
import { DistanceConverter } from '@/components/tools/DistanceConverter';
import { JapanTime } from '@/components/tools/JapanTime';
import { Base64ToImage } from '@/components/tools/Base64ToImage';
import StringEscapeUtilities from '@/components/tools/StringEscapeUtilities';
import QuoteUtilities from '@/components/tools/QuoteUtilities';
import TextJoiner from '@/components/tools/TextJoiner';
import TextSplitter from '@/components/tools/TextSplitter';
import SlugGenerator from '@/components/tools/SlugGenerator';
import UuidGenerator from '@/components/tools/UuidGenerator';
import LoremGenerator from '@/components/tools/LoremGenerator';
import NumberGenerator from '@/components/tools/NumberGenerator';
import NameGenerator from '@/components/tools/NameGenerator';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import StringGenerator from '@/components/tools/StringGenerator';
import ColorGenerator from '@/components/tools/ColorGenerator';
import HtmlConverter from '@/components/tools/HtmlConverter';
import UrlConverter from '@/components/tools/UrlConverter';
import JsonXmlConverter from '@/components/tools/JsonXmlConverter';
import NumberBaseConverter from '@/components/tools/NumberBaseConverter';
import JsonValidator from '@/components/tools/JsonValidator';
import CssValidator from '@/components/tools/CssValidator';
import HashGenerator from '@/components/tools/HashGenerator';
import AesEncryption from '@/components/tools/AesEncryption';
import Base64Encryption from '@/components/tools/Base64Encryption';
import RsaEncryption from '@/components/tools/RsaEncryption';
import {
  LengthConverter,
  TemperatureConverter,
  WeightConverter,
  AreaConverter,
  VolumeConverter,
  TimeConverter,
  CurrencyConverter,
} from '@/components/tools/unit-converters';
import { BasicCalculator } from '@/components/tools/calculators';
import { AsciiArtGenerator } from '@/components/tools/miscellaneous';
import { Tool } from '@/types';

const toolComponents: Record<string, React.ComponentType> = {
  CaseConverter,
  Base64Converter,
  DistanceConverter,
  JapanTime,
  Base64ToImage,
  // String Utilities
  StringEscapeUtilities,
  QuoteUtilities,
  TextJoiner,
  TextSplitter,
  SlugGenerator,
  // Random Generators
  UuidGenerator,
  LoremGenerator,
  NumberGenerator,
  NameGenerator,
  PasswordGenerator,
  StringGenerator,
  ColorGenerator,
  // Converters
  HtmlConverter,
  UrlConverter,
  JsonXmlConverter,
  NumberBaseConverter,
  // Validators
  JsonValidator,
  CssValidator,
  // Cryptography
  HashGenerator,
  AesEncryption,
  Base64Encryption,
  RsaEncryption,
  // Unit Converters
  LengthConverter,
  TemperatureConverter,
  WeightConverter,
  AreaConverter,
  VolumeConverter,
  TimeConverter,
  CurrencyConverter,
  // Calculators
  BasicCalculator,
  // Miscellaneous
  AsciiArtGenerator,
};

// Placeholder component for tools that aren't implemented yet
const PlaceholderTool: React.FC<{ tool: Tool }> = ({ tool }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Tool Under Development
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The <strong>{tool.name}</strong> tool is currently under development and will be available in an upcoming version.
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Expected Features:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {tool.capabilities.map((capability) => (
            <Chip
              key={capability}
              label={capability}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Category: <strong>{tool.category.replace('-', ' ')}</strong>
        {tool.subcategory && (
          <>
            {' • '}
            Subcategory: <strong>{tool.subcategory}</strong>
          </>
        )}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        Thank you for your patience while we continue building this tool!
      </Typography>
    </Box>
  );
};

export const HomePage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  
  // Initialize URL synchronization
  useUrlSync();
  const { getToolFromUrl, closeTool, openTool } = useToolUrl();
  const { getCurrentUrl, getToolUrl } = useShareableUrl();
  const router = useRouter();
  const tools = useAppSelector((state: any) => state.tools.tools);

  // Sync tool selection with URL
  useEffect(() => {
    const toolIdFromUrl = getToolFromUrl();
    
    if (toolIdFromUrl) {
      const tool = tools.find((t: Tool) => t.id === toolIdFromUrl);
      if (tool && (!selectedTool || selectedTool.id !== tool.id)) {
        setSelectedTool(tool);
      }
    } else if (selectedTool) {
      setSelectedTool(null);
    }
  }, [getToolFromUrl, tools, selectedTool]);

  const handleToolOpen = (tool: Tool) => {
    setSelectedTool(tool);
    openTool(tool.id, false); // Open as modal with URL sync
  };

  const handleToolClose = () => {
    setSelectedTool(null);
    closeTool(); // Remove tool from URL
  };

  const handleShareTool = async () => {
    if (!selectedTool) return;
    
    const shareUrl = getToolUrl(selectedTool.id, false);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedTool.name,
          text: selectedTool.description,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  const handleOpenInPage = () => {
    if (!selectedTool) return;
    
    const pageUrl = getToolUrl(selectedTool.id, true);
    window.open(pageUrl, '_blank');
  };

  const handleOpenFullscreen = () => {
    if (!selectedTool) return;
    
    // Navigate to the tool page in the same window
    const toolPagePath = `/tools/${selectedTool.id}`;
    router.push(toolPagePath);
  };

  const ToolComponent = selectedTool ? toolComponents[selectedTool.component] : null;

  return (
    <>
      <TopNavigation />
      <Container maxWidth="lg">
        <ToolGrid onToolOpen={handleToolOpen} />
      </Container>

      <Dialog
        open={!!selectedTool}
        onClose={handleToolClose}
        maxWidth="md"
        fullWidth
        scroll="body"
      >
        {selectedTool && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  {selectedTool.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={handleShareTool}
                    title="Share tool"
                    size="small"
                  >
                    <Share />
                  </IconButton>
                  <IconButton 
                    onClick={handleOpenFullscreen}
                    title="Open fullscreen (same window)"
                    size="small"
                  >
                    <Fullscreen />
                  </IconButton>
                  <IconButton 
                    onClick={handleOpenInPage}
                    title="Open in new page"
                    size="small"
                  >
                    <OpenInNew />
                  </IconButton>
                  <IconButton onClick={handleToolClose}>
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              {ToolComponent ? (
                <ToolComponent />
              ) : (
                <PlaceholderTool tool={selectedTool} />
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};
