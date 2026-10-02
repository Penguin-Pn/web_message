# THEUIP File Format

## Overview

The `.theuip` file format is designed for themes in the **Penguin Web Messaging**
system. It encapsulates color palettes, dark/light mode settings, and
locale-specific character configurations. The name **theuip** stands for
"Theme User Internal for Penguin Web Messaging".

The format is used by Penguin Web Messaging and by systems based on it. The
file structure, magic number, and compression scheme are publicly documented
in this specification. The JSON schema and interpretation rules are
maintained by the Penguin Web Messaging project and may evolve over time.

## File Structure

A `.theuip` file is a binary container with the following minimum layout:

| Offset | Size    | Field         | Description                                              |
|--------|---------|---------------|----------------------------------------------------------|
| 0      | 1 byte  | Magic Prefix  | `0x89`                                                   |
| 1      | 7 bytes | Magic String  | ASCII `THEUIP\n` (0x54 48 45 55 49 50 0A)               |
| 8      | 4 bytes | Original Size | Big-endian uint32, size of decompressed payload in bytes |
| 12     | N bytes | Payload       | zlib-compressed (RFC 1950) JSON payload                  |

The decompressed payload is a UTF-8 encoded JSON document. The internal schema
of this JSON document is defined and maintained by the Penguin Web Messaging
project and is subject to change between versions.

## File Extension

`.theuip`

## MIME Type

`application/vnd.penguin-pn.theuip`

## Security Considerations

1. **Decompression limits:** Implementations MUST enforce a strict maximum size
   limit on the decompressed zlib payload to prevent denial-of-service (DoS)
   attacks via decompression bombs (zip bombs). A reasonable implementation
   SHOULD reject payloads exceeding 1 MiB after decompression, and SHOULD
   abort decompression if the compression ratio exceeds 100:1.

2. **Payload validation:** The decompressed JSON payload MUST be validated
   against an expected structure before parsing to prevent unexpected data
   structures or parser abuse.

3. **CSS sanitization:** Since theme data is eventually rendered as CSS by the
   client application, the application MUST sanitize the generated CSS to
   prevent UI redressing or style-based injection attacks. Implementations
   SHOULD reject `@import`, external `url()` references, `expression()`,
   and similar constructs.

4. **Untrusted sources:** Theme files from untrusted sources SHOULD be
   processed in a sandboxed environment to mitigate potential risks.

## Intended Usage

The `.theuip` format is intended for use by Penguin Web Messaging and any
systems derived from it. Registrations under `application/vnd.penguin-pn.*`
are maintained by Penguin Web Messaging.
