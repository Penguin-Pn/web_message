# Media Type: application/vnd.penguin-pn.theuip

## 1. Introduction
The `application/vnd.penguin-pn.theuip` media type defines an openly documented binary format used for storing and transmitting UI themes for the **Penguin Web Messaging** application. 

The format encapsulates a zlib-compressed JSON payload. The JSON data contains CSS variables (colors, shadows, etc.) and localized strings required to render the user interface. The format is designed to be compact, fast to parse, and easily shareable between users.

## 2. File Structure
A `.theuip` file is a binary container with the following minimum layout. All multi-byte integers are encoded in **Big-Endian** byte order.

| Offset | Size (Bytes) | Field | Description |
| :--- | :--- | :--- | :--- |
| 0 | 1 | Magic Prefix | `0x89` (High-bit set to prevent text misinterpretation) |
| 1 | 7 | Magic String | ASCII `THEUIP\n` (`0x54 48 45 55 49 50 0A`) |
| 8 | 4 | Original Size | Unsigned 32-bit integer (Big-Endian) for the decompressed payload size. |
| 12 | N | Payload | zlib-compressed (RFC 1950) JSON payload. |

### 2.1 Payload Schema
The decompressed payload MUST be a valid UTF-8 encoded JSON document. The base JSON schema is defined and maintained by the Penguin Web Messaging project. While the base structure is stable, future versions may introduce optional fields for extensibility without breaking backward compatibility. The JSON object may contain:
*   `style` (Object): CSS custom properties (e.g., `--bg-main`).
*   `strs` (Object): Localized UI strings.

## 3. Security Considerations
Because the file contains compressed data that is transformed into CSS and injected into the DOM, the following security measures are strictly enforced by implementations:

1.  **Decompression Bombs (DoS)**: Implementations MUST enforce a strict maximum size limit (e.g., 5 MiB) on both the compressed file size and the decompressed payload size. The size is verified using the 4-byte header before decompression begins.
2.  **CSS Injection**: The decompressed JSON is sanitized. Only approved CSS variables are allowed. Arbitrary CSS rules, scripts, or external imports are stripped to prevent UI redressing or cross-site scripting (XSS).
3.  **Resource Exhaustion**: String payloads within the JSON are limited to a maximum size (e.g., 2 MiB) to prevent memory exhaustion.

## 4. Reference Implementation
A reference JavaScript implementation for encoding and decoding `.theuip` files (utilizing `fflate` for zlib compression) is openly available at:
`https://github.com/Penguin-Pn/web_message/blob/main/theuip.js`

## 5. IANA Considerations
This document registers the media type `application/vnd.penguin-pn.theuip` in the IANA Media Types registry.

*   **Type name:** application
*   **Subtype name:** vnd.penguin-pn.theuip
*   **Required parameters:** N/A
*   **Optional parameters:** N/A
*   **Encoding considerations:** binary
*   **Security considerations:** See Section 3 of this document.
*   **Interoperability considerations:** N/A
*   **Published specification:** This document.
*   **Applications that use this media type:** Penguin Web Messaging and its associated theme editor and parser tools.
*   **Fragment identifier considerations:** N/A
*   **Additional information:**
    *   **Magic number(s):** `0x89 54 48 45 55 49 50 0A`
    *   **File extension(s):** `.theuip`
*   **Intended usage:** COMMON
*   **Restrictions on usage:** N/A
*   **Author/Change controller:** Penguin Web Messaging
*   **Provisional registration:** No
