ththe n# QR Codes for WICC Masjid Fundraiser

This directory contains the QR codes for the donation page.

## Required Files

### 1. Masjid Payment QR Code
- **File:** `masjid-payment-qr.png`
- **Purpose:** Direct payment to WICC's custom donation system
- **Size:** 128x128 pixels (minimum)
- **Format:** PNG (recommended)

### 2. Launchgood QR Code
- **File:** `launchgood-qr.png`
- **Purpose:** Donate through Launchgood's trusted platform
- **Size:** 128x128 pixels (minimum)
- **Format:** PNG (recommended)

## How to Add Your QR Codes

1. **Generate QR Codes:**
   - Use any QR code generator (QR Code Generator, Google QR Code API, etc.)
   - For Masjid Payment: Generate QR code pointing to your donation page URL
   - For Launchgood: Generate QR code pointing to your Launchgood campaign URL

2. **Save the Images:**
   - Save as `masjid-payment-qr.png` and `launchgood-qr.png`
   - Place both files in this directory (`public/qr-codes/`)

3. **Image Requirements:**
   - Minimum size: 128x128 pixels
   - Recommended size: 256x256 pixels for better quality
   - Format: PNG (for transparency support)
   - High contrast: Black QR code on white background

## Example URLs for QR Codes

### Masjid Payment QR Code
```
https://your-domain.com/donate
```

### Launchgood QR Code
```
https://www.launchgood.com/campaign/your-campaign-url
```

## Testing

After adding the QR codes:
1. Visit the donation page
2. Scroll to the "Quick Donate with QR Codes" section
3. Verify both QR codes are displayed correctly
4. Test scanning with a mobile device

## Troubleshooting

- **Images not showing:** Check file paths and ensure images are in `public/qr-codes/`
- **Blurry QR codes:** Use higher resolution images (256x256 or larger)
- **QR codes not scanning:** Ensure high contrast and proper sizing
