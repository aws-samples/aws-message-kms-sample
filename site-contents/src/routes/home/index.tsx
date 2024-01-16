import { Box, Container } from '@cloudscape-design/components';
import { UnifiedAppLayout } from '../../components/common/unified-app-layout';
import './style.css';

export const Home = () => {

  return (
    <UnifiedAppLayout 
      content={
        <Container>
          <Box
            variant="h1"
            textAlign="center"
            margin={{ vertical: 'xxxl' }}
          >
            Welcome to KMS Workshop ! :)
          </Box>
        </Container>
      }
    />
  );
}
