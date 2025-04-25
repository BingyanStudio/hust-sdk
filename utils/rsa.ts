import crypto from 'node:crypto';

const rsaPublicKey =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMVD74ZtUWvF23rTDYPOqZq30PfJMDf4xnTj/59tlTqR0QjguhYY0imugSqer4hYEzZhezfxMV8YOdIHbw5wZDkCAwEAAQ==';

export function rsaEncrypt(publicKey: string, data: Buffer): Buffer {
  const formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
  return crypto.publicEncrypt(
    {
      key: crypto.createPublicKey(formattedPublicKey),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    data,
  );
}

// console.log(rsaEncrypt(rsaPublicKey, Buffer.from('123456')));
