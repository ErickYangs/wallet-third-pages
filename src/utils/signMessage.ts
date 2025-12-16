// import { LoginType } from "@taskon/embed";

// PKCS#1 private key in base64 format (matches Go code format)
const TEST_PK_BASE64 = 'MIIEowIBAAKCAQEArQAMXizjvm408YHB397cTskwl6XswmDycgceIEKShhGxKVbpwoilUE6I+5tB1ZXPBpq2XxEayWF6SznUv9WAiwpEP7Qi8OvizXLFUGYpNLya9XXw79sxfJpi0KFA26aHXtVxZIMgwhJFnLasgy0SKsmzDZiYtOfySkxAwP2yTuMJGP2rnz0FsaIIEMxKiSbaNzl9hCcoyILdIEMPxS6qjLvhWb9cECbXyaEcY0jYtrOoylpfvIB5HJUnjSr5tyPJzlaBLeVKKCfw95ZNn7LfOdZlW34a9XlZBqHdKolWCwSuLZO1M5QXipK6G7880w+DzeDaUU6YZD2lzkr+9QuO4QIDAQABAoIBABAmXwEzo5cVZq/c8yJZBav9MCIYBUAoGLn4XCGa1V7aq/U1/eCBLR2QF02VstGjiI4PR1Mcn6mJBgebwHagEb3pGXHw+QoQmz2epzjYMKSRrs2XUwSxK698Ihlj1FAs/Zomxs0hSJ+VYRY+H2CnhnikF6j/Q9IvjPjOoYTiqhCfDcSPNN91PbLGplUWSp8rk5b+gq8dSjbWiisigMtvNGT8ivC7r+V35U45wEa+yHRVjvDZofQF2+aeSejUqFySz3CpM0RAu1tnCIX2MeGrN7puu+I6Vk+5ycIlzGd0GdQ/2oEEr91y0lPcGUTmwCapqkgazyyUp+QX3bkGkElO6hkCgYEAwwplFlvm+VosMbXjExlVm3E9Vz6bSyoIHq0xOUAvTcwrnFOi1yoN+yLstlBbJ4kcfL8F539UGJlnIagLm40NvopPs9LcvDCauvfiLEOWJ7h0JmKcMWTdwd8yLEpSrsuMlkDrTmp28yKzX2U2fKipEdH1hFOq1dW9zmT3j6Ome18CgYEA4xInYK3y/16PJfPzBSnDPNMepGeGSWc21M7DV5F3i3Ea2/FUpaftD5yeM1arx6StYSsw3m+Poi/nHh4XCGq6PP+LHXenk7xeQ+7aNvT2lJ9TFddl8tn/XhT1vDR3NNUdmIP/poy/FjvrMNPS7/nJEsHg0krOgSpV6/YThsF8Xb8CgYAmrHH86/4xpVqsBLfg+p4J83tJSGW8kroHcyoWgw6eK4TeO4tHhNQ+3t73C5n3je1zIuGF1K6VLh3QA6VBk8eM55oEOyR/wFd+CVb0lfY5LA8D6Xu1I54BKkOlmpsog739sSO3ac7qSRAuM0CJmVvk56/6LCjsu7QmL8kS101UmwKBgHO+hy/yuxCMpK8V4GRbW1efzdjDpGG6KOrk0hHK5oK/jo9aPmmKZX41uTY2Ea3cNTx4hZp8h1yGympBsD/sFy6Mm97TZSobNHmwQK8OwroTVIinmSHnGRJd4Lykibb2gvWBI0lEKQsuU7452yXTzziuduj6lLSmXdG/R0jDS5+FAoGBAI02/jNfrUFnCYesbkaz9BJ9gUiJP2BvjxRUAWymeinLKkOIvVfZ7500vEdSC2vCBO0g4mBUzybON6S9o7aj8BsgCyfIGxNqHyc27EVLVrea29xjpUX2EoH8xqKtzHTdozocYHdOtTmDVtYwA+GLigJw8o85hZSz5pKWQmvrzt7i'
export const signMessage = async (clientId: string, loginType: 'Email' | 'evm', value: string): Promise<{
  signature: string;
  timestamp: number;
}> => {
  const timestamp = Date.now();
  const message = `${loginType}|${value}|${clientId}|${timestamp}`;
  console.log('sign source message', message);

  // If running in Node or WebCrypto not available, fallback to Node signer
  if (typeof window === 'undefined' || !(globalThis.crypto && (globalThis.crypto as Crypto).subtle)) {
    return signMessageNode(clientId, loginType, value);
  }

  // Browser: use WebCrypto SubtleCrypto with RSASSA-PKCS1-v1_5 and SHA-256
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(message);

  // Convert PKCS#1 DER to PKCS#8 DER for WebCrypto import
  const pkcs1Der = base64ToUint8(TEST_PK_BASE64);
  const pkcs8Der = wrapPkcs1ToPkcs8(pkcs1Der);

  const cryptoKey = await (globalThis.crypto as Crypto).subtle.importKey(
    'pkcs8',
    pkcs8Der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await (globalThis.crypto as Crypto).subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    cryptoKey,
    data
  );

  return {
    signature: arrayBufferToBase64(signature),
    timestamp: timestamp
  };
}


/**
 * Sign message with Node.js
 */
export const signMessageNode = async (clientId: string, loginType: 'Email' | 'evm', value: string): Promise<{
  signature: string;
  timestamp: number;
}> => {
  const timestamp = Date.now();
  const message = `${loginType}|${value}|${clientId}|${timestamp}`;
    // Use dynamic require to avoid bundling Node 'crypto' into browser builds
    const { sign } = (await import('crypto')) as typeof import('crypto');
    const privateKeyBuffer = Buffer.from(TEST_PK_BASE64, 'base64');
    const signature = sign('RSA-SHA256', new TextEncoder().encode(message), {
      key: privateKeyBuffer,
      format: 'der',
      type: 'pkcs1'
    });
    return {
      signature: signature.toString('base64'),
      timestamp: timestamp
    };
  };

// ---------- Helpers (browser) ----------
function base64ToUint8(base64: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  // Node fallback
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  if (typeof btoa === 'function') {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  // Node fallback
  return Buffer.from(new Uint8Array(buf)).toString('base64');
}

// Wrap PKCS#1 RSAPrivateKey DER into PKCS#8 PrivateKeyInfo DER
function wrapPkcs1ToPkcs8(pkcs1Der: Uint8Array): ArrayBuffer {
  // ASN.1 helpers
  const encodeLength = (len: number): number[] => {
    if (len < 0x80) return [len];
    const bytes: number[] = [];
    let tmp = len;
    while (tmp > 0) {
      bytes.unshift(tmp & 0xff);
      tmp >>= 8;
    }
    return [0x80 | bytes.length, ...bytes];
  };

  const seq = (content: number[]): number[] => [0x30, ...encodeLength(content.length), ...content];
  const objId = (oid: number[]): number[] => [0x06, ...encodeLength(oid.length), ...oid];
  const nullDer = (): number[] => [0x05, 0x00];
  const int0 = (): number[] => [0x02, 0x01, 0x00];
  const octetStr = (bytes: Uint8Array): number[] => [0x04, ...encodeLength(bytes.length), ...Array.from(bytes)];

  // rsaEncryption OID: 1.2.840.113549.1.1.1 -> DER bytes
  const rsaEncryptionOid = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01];

  const algorithmIdentifier = seq([...objId(rsaEncryptionOid), ...nullDer()]);
  const privateKey = octetStr(pkcs1Der);

  const privateKeyInfo = seq([
    ...int0(), // version = 0
    ...algorithmIdentifier,
    ...privateKey
  ]);

  return new Uint8Array(privateKeyInfo).buffer;
}