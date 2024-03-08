import { useCallback } from 'react';
import {
  AppLayout,
  Box,
  Button,
  Container,
  ContentLayout,
  Grid,
  Header,
  SpaceBetween
} from '@cloudscape-design/components';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as KeyIcon } from '../../assets/images/key.svg';

export type UnifiedAppLayoutProps = {
  content: JSX.Element
}

export const UnifiedAppLayout = ({ content }: UnifiedAppLayoutProps) => {
  const navigate = useNavigate();

  const onEncryptionClick = useCallback(() => {
    navigate('/encryption');
  }, [navigate]);

  const onDecryptionClick = useCallback(() => {
    navigate('/decryption');
  }, [navigate]);

  return (
    <AppLayout
      content={
        <ContentLayout
          header={
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box
                variant="div"
                margin={{ top: "l" }}
              >

                <Header
                  variant="h1"
                >
                  <span className="key-icon">
                    <KeyIcon />
                  </span>
                  {"KMS Workshop"}
                </Header>
              </Box>
            </Link>
          }
        >
          <SpaceBetween size="m">
            <Container>
              <Grid
                gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}
              >
                <Box textAlign='center'>
                  <Button variant="primary" onClick={onEncryptionClick}>
                    Encryption
                  </Button>
                </Box>
                <Box textAlign='center'>
                  <Button variant="primary" onClick={onDecryptionClick}>
                    Decryption
                  </Button>
                </Box>
              </Grid>
            </Container>
            {content}
          </SpaceBetween>
        </ContentLayout>
      }
      navigationHide={true}
      toolsHide={true}
    />
  );
}
