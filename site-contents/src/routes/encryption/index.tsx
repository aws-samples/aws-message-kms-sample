import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import encryptedMessagesAtom from '../../recoil/encrypted/atom';
import keyArnAtom from '../../recoil/key/atom';
import { Alert, Box, Button, Container, FormField, Grid, Header, Input, Pagination, SpaceBetween } from '@cloudscape-design/components';
import { UnifiedAppLayout } from '../../components/common/unified-app-layout';
import { useEncryptMessage } from '../../hooks/use-encrypt-message';

export const Encryption = () => {
  const [message, setMessage] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const [encryptedMessages, setEncryptedMessages] = useRecoilState(encryptedMessagesAtom);
  const [keyArn, setKeyArn] = useRecoilState(keyArnAtom);

  const { mutate: encryptMessage } = useEncryptMessage({
    onSuccess: (result: any) => {
      setEncryptedMessages(
        prev => [
          ...prev,
          result.ciphering,
        ]
      );
    }
  });

  useEffect(() => {
    setCurrentPageIndex(encryptedMessages.length - 1);
  }, [encryptedMessages]);

  const onEncryptMessage = useCallback(() => {
    encryptMessage({
      keyId: keyArn,
      message,
    });
  }, [encryptMessage, keyArn, message]);

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
              description="ARN of KMS key. e.g. arn:aws:kms:us-west-2:111111111111:key/1111a111-11a1-1a11-a1a1-a1a1a11aa1aa"
              label="KMS key ARN"
            >
              <Input
                value={keyArn}
                onChange={event =>
                  setKeyArn(event.detail.value)
                }
              />
            </FormField>
            <FormField
              description="Message to be encrypted by KMS."
              label="Message"
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
                onClick={onEncryptMessage}
              >
                Encrypt
              </Button>
            </Box>
            </SpaceBetween>
          </Box>
          <Container fitHeight>
            <div style={{ height: '100%' }}>
              <SpaceBetween size="s">
                <Header>
                  Encrypted Messages
                </Header>
                {(!encryptedMessages || encryptedMessages.length === 0) && 
                  <Alert
                    statusIconAriaLabel="Info"
                  >
                    Encrypted messages will appear here :) 
                  </Alert>
                }
                {encryptedMessages && encryptedMessages.length > 0 && 
                  <>
                    <Container fitHeight>
                      {encryptedMessages[currentPageIndex]}
                    </Container>
                    <Pagination
                      currentPageIndex={currentPageIndex + 1}
                      onChange={({ detail }) =>
                        setCurrentPageIndex(detail.currentPageIndex - 1)
                      }
                      pagesCount={encryptedMessages.length}
                    />
                  </>
                }
                {/* <div>{"AgV47XfHg7xKMALZ1QXW5N85iiNMrENEHSiop+dfC5a4MuIAhwACABFFeGFtcGxlQ29udGV4dEtleQATRXhhbXBsZUNvbnRleHRWYWx1ZQAVYXdzLWNyeXB0by1wdWJsaWMta2V5AERBeGFaeWF6MHgwWXZGaGY1OENBZS94UWZWa3c1d1pGTHI3RGZSR2VxSGpkbmhwNkxZclFFZzIvREpadHlKVHRMelE9PQABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6NTY2MDM0MDM4NzUyOmtleS84Njc2ZDg4Mi01OGM5LTRmMjktYThmMy1hNGYyZjY1Y2QxY2UAuAECAQB4h9/LyTgUt1reYnNuRhHJeG8eq2t7V0LBoBnOA9GnGcABRVJx6Civ9II7NOGgfUrZvQAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDOWdSV5Cg4krJwM5dgIBEIA7CsgxPWyldZ9+u95jblt+0DwUe7WPv5hkj0V8w9QRYJybvrmZv4DhoP3tJgS1vHAI38IiZC+xRSuW4aACAAAQAKJyv6mpRT007/wSqXWXuIkSWVkMH0Q2bPFDs7Xb9gOwZrY3e7OEVZTUSlro/PARS/////8AAAABAAAAAAAAAAAAAAABAAAAD4Mh3NkCtMnXxCccqkyfTaYU01n89Ii+InIpeP1Rck0AZzBlAjAWc2C4V0ugswcn8uVptnPwHIHjZPyORGP8+oFoyMvA9as3+pgbimQ0FmucNpCfyrACMQDV/B8WbjjS6r9gJoM5F/7OkP4L5U09p3tWOlXWVqmYf2TLb3lWKgdzHLpcAy/gM8c="}</div>
                <Pagination
                  currentPageIndex={currentPageIndex}
                  onChange={({ detail }) =>
                    setCurrentPageIndex(detail.currentPageIndex)
                  }
                  pagesCount={13}
                /> */}
              </SpaceBetween>
            </div>
          </Container>
          </Grid>
        </Container>
      }
    />
  );
}
