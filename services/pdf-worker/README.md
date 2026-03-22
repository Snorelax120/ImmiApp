# PDF Worker Scaffold

This directory is the same-repo seam for the future `Path B: PDFium` implementation needed for IRCC XFA PDFs.

## Current status

- The Next.js app already prepares a normalized payload for the worker.
- The worker exposes:
  - `GET /health`
  - `POST /fill-xfa`
- The current implementation is a contract-safe scaffold.
- Real XFA field filling is **not implemented yet**.

## Why this exists

Many IRCC forms use XFA PDFs, which are harder to fill than standard AcroForm PDFs. The hackathon app now generates:

- a matched IRCC package
- a required document checklist
- applicant field data
- a normalized PDF worker payload

This worker is where that payload will later be transformed into filled IRCC PDFs using `pypdfium2` / PDFium.

## Local setup

```bash
cd services/pdf-worker
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## App integration

Set these values in the app environment when you want the Next.js API to call the worker:

```bash
PDF_WORKER_URL=http://localhost:8000
PDF_WORKER_API_KEY=
```

## Expected request contract

```json
{
  "templateId": "IMM1295E",
  "applicationId": "work-permit",
  "applicantInfo": {
    "fullName": "Ava Patel",
    "passportNumber": "N12345678"
  },
  "documentInputs": [
    {
      "documentId": "passportCopy",
      "status": "ready",
      "notes": "passport-scan.pdf"
    }
  ],
  "generatedAt": "2026-03-22T00:00:00.000Z"
}
```

## Next implementation step

1. Validate one real IRCC XFA template at a time.
2. Build a field map from normalized app keys to XFA field names.
3. Implement render/save support per template.
4. Return a file artifact or download URL back to the Next.js app.
