import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Container, FormField, Grid, Header, Input, Pagination, SpaceBetween } from '@cloudscape-design/components';
import { UnifiedAppLayout } from '../../components/common/unified-app-layout';
import { useRecoilState } from 'recoil';
import decryptedMessagesAtom from '../../recoil/decrypted/atom';
import { useDecryptMessage } from '../../hooks/use-decrypt-message';
import cipherTextBlobAtom from '../../recoil/cipher/atom';

export const Decryption = () => {
  const [message, setMessage] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const [decryptedMessages, setDecryptedMessages] = useRecoilState(decryptedMessagesAtom);
  const [cipherTextBlob, setCipherTextBlob] = useRecoilState(cipherTextBlobAtom);

  const { mutate: decryptMessage } = useDecryptMessage({
    onSuccess: (result: any) => {
      console.log(result);
      setDecryptedMessages(
        prev => [
          ...prev,
          result.body.plainmessage,
        ]
      );
    }
  });

  useEffect(() => {
    setCurrentPageIndex(decryptedMessages.length - 1);
  }, [decryptedMessages]);

  const onDecryptMessage = useCallback(() => {
    decryptMessage({
      cipherTextBlob,
      encryptedData: message,
    });
  }, [cipherTextBlob, decryptMessage, message]);

  return (
    <UnifiedAppLayout 
      content={
        <Container>
          <Grid
            gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}
          >
          <Box variant="div">
            <SpaceBetween size="xxl">
            <FormField
              description="Cipher text blob retrieved from encryption."
              label="Cipher Text Blob"
            >
              <Input
                value={cipherTextBlob}
                onChange={event =>
                  setCipherTextBlob(event.detail.value)
                }
              />
            </FormField>
            <FormField
              description="Message encrypted by KMS to be decrypted."
              label="Encrypted Message"
            >
              <Input
                value={message}
                onChange={event =>
                  setMessage(event.detail.value)
                }
              />
            </FormField>
            <Box variant="div" textAlign="right">
              <Button
                onClick={onDecryptMessage}
              >
                Decrypt
              </Button>
            </Box>
            </SpaceBetween>
          </Box>
          <Container fitHeight>
            <div style={{ height: '100%' }}>
              <SpaceBetween size="s">
                <Header>
                  Decrypted Messages
                </Header>
                {(!decryptedMessages || decryptedMessages.length === 0) && 
                  <Alert
                    statusIconAriaLabel="Info"
                  >
                    Decrypted messages will appear here :) 
                  </Alert>
                }
                {decryptedMessages && decryptedMessages.length > 0 && 
                  <>
                    <Container fitHeight>
                      {decryptedMessages[currentPageIndex]}
                    </Container>
                    <Pagination
                      currentPageIndex={currentPageIndex + 1}
                      onChange={({ detail }) =>
                        setCurrentPageIndex(detail.currentPageIndex - 1)
                      }
                      pagesCount={decryptedMessages.length}
                    />
                  </>
                }
              </SpaceBetween>
            </div>
          </Container>
          </Grid>
        </Container>
      }
    />
  );
}
