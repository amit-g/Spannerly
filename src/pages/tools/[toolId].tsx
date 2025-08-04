import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Container, Box, Typography, Button, Breadcrumbs, Link, Paper } from '@mui/material';
import { ArrowBack, Home, Launch, Construction } from '@mui/icons-material';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Tool } from '@/types';
import { useToolUrl } from '@/hooks/useUrlSync';

// Import all tool components (same as HomePage)
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

// Import tools data
import { allTools } from '@/store/toolsSlice';

const getAllTools = () => allTools;
const getToolById = (id: string) => allTools.find((tool: Tool) => tool.id === id) || null;

const toolComponents: Record<string, React.ComponentType> = {
  CaseConverter,
  Base64Converter,
  DistanceConverter,
  JapanTime,
  Base64ToImage,
  StringEscapeUtilities,
  QuoteUtilities,
  TextJoiner,
  TextSplitter,
  SlugGenerator,
  UuidGenerator,
  LoremGenerator,
  NumberGenerator,
  NameGenerator,
  PasswordGenerator,
  StringGenerator,
  ColorGenerator,
  HtmlConverter,
  UrlConverter,
  JsonXmlConverter,
  NumberBaseConverter,
  JsonValidator,
  CssValidator,
  HashGenerator,
  AesEncryption,
  Base64Encryption,
  RsaEncryption,
  LengthConverter,
  TemperatureConverter,
  WeightConverter,
  AreaConverter,
  VolumeConverter,
  TimeConverter,
  CurrencyConverter,
  BasicCalculator,
  AsciiArtGenerator,
};

interface ToolPageProps {
  tool: Tool | null;
}

const PlaceholderTool: React.FC<{ tool: Tool }> = ({ tool }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Construction sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
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
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {tool.capabilities.map((capability) => (
            <Box key={capability} component="span" sx={{ display: 'inline-block', m: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.5,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                }}
              >
                {capability}
              </Typography>
            </Box>
          ))}
        </Box>
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

export default function ToolPage({ tool }: ToolPageProps) {
  const router = useRouter();
  const { openTool } = useToolUrl();

  if (router.isFallback) {
    return (
      <>
        <TopNavigation />
        <Container maxWidth="lg">
          <Typography>Loading...</Typography>
        </Container>
      </>
    );
  }

  if (!tool) {
    return (
      <>
        <TopNavigation />
        <Container maxWidth="lg">
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Tool Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The requested tool could not be found.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/')}
              startIcon={<Home />}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  const ToolComponent = toolComponents[tool.component];

  return (
    <>
      <TopNavigation />
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/')}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Home sx={{ mr: 0.5, fontSize: 16 }} />
              Home
            </Link>
            <Typography variant="body2" color="text.primary">
              {tool.category.replace('_', ' ').replace('-', ' ')}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {tool.name}
            </Typography>
          </Breadcrumbs>

          {/* Navigation Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                router.push('/');
                setTimeout(() => openTool(tool.id, false), 100);
              }}
              startIcon={<Launch />}
            >
              Open as Modal
            </Button>
          </Box>

          {/* Tool Content */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {tool.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {tool.description}
            </Typography>

            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <PlaceholderTool tool={tool} />
            )}
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tools = getAllTools();
  
  const paths = tools.map((tool: Tool) => ({
    params: { toolId: tool.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const toolId = params?.toolId as string;
  const tool = getToolById(toolId);

  return {
    props: {
      tool,
    },
  };
};
