# THEUIP File Format

## Overview
The `.theuip` file format is designed for themes in the **Penguin Web Messaging** system.
It encapsulates color palettes, dark/light mode settings, and locale-specific 
character configurations. The name **theuip** stands for 
"Theme User Internal for Penguin Web Messaging".

This is a **proprietary format**, and the parser for this format is exclusively 
included in the Penguin Web Messaging project code. The internal JSON schema 
and interpretation rules are not publicly documented.

## File Structure
A `.theuip` file is a binary container with the following minimum layout:

| Offset | Size    | Field         | Description                                  |
|--------|---------|---------------|----------------------------------------------|
| 0      | 1 byte  | Magic Prefix  | `0x05`                                       |
| 1      | 7 bytes | Magic String  | ASCII `THEUIP\n` (0x54 48 45 55 49 50 0A)  |
| 8      | 4 bytes | Original Size | Big-endian uint32, size of decompressed payload in bytes |
| 12     | N bytes | Payload       | zlib-compressed (RFC 1950) JSON payload      |

The decompressed payload is a UTF-8 encoded JSON document. The internal schema 
of this JSON document is proprietary and not publicly documented.

## File Extension
`.theuip`

## MIME Type
`application/vnd.penguin.theuip+json`

## Security Considerations
1. **Decompression limits:** Implementations MUST enforce a strict maximum size 
   limit on the decompressed zlib payload to prevent denial-of-service (DoS) 
   attacks via decompression bombs (zip bombs).
2. **Payload validation:** The decompressed JSON payload MUST be validated before 
   parsing to prevent unexpected data structures or parser abuse.
3. **CSS sanitization:** Since theme data is eventually rendered as CSS by the 
   client, the application MUST sanitize generated CSS to prevent UI redressing 
   or style-based injection attacks.
4. **Untrusted sources:** Theme files from untrusted sources should be processed 
   in a sandboxed environment.
