from __future__ import annotations

from typing import Dict, List, Literal, Optional

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

try:
    import pypdfium2  # noqa: F401

    PDFIUM_AVAILABLE = True
except Exception:
    PDFIUM_AVAILABLE = False


class DocumentInput(BaseModel):
    documentId: str
    status: Literal["ready", "needs-help", "missing"]
    notes: str = ""


class FillRequest(BaseModel):
    templateId: str
    applicationId: str
    applicantInfo: Dict[str, str] = Field(default_factory=dict)
    documentInputs: List[DocumentInput] = Field(default_factory=list)
    generatedAt: str


class FillResponse(BaseModel):
    status: Literal["connected", "not_supported"]
    message: str
    details: Optional[str] = None
    echoedFieldCount: int
    templateId: str


app = FastAPI(
    title="IRCC PDF Worker",
    description=(
        "Same-repo scaffold for future PDFium/XFA form filling. "
        "This service currently validates payloads and returns a contract-safe "
        "placeholder response."
    ),
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "pdfium_available": PDFIUM_AVAILABLE,
        "xfa_mode": "scaffold",
        "message": "Worker is reachable. XFA filling is not implemented yet.",
    }


@app.post("/fill-xfa", response_model=FillResponse)
def fill_xfa(
    payload: FillRequest,
    x_api_key: Optional[str] = Header(default=None),
):
    expected_api_key = None

    if expected_api_key and x_api_key != expected_api_key:
        raise HTTPException(status_code=401, detail="Invalid API key.")

    return FillResponse(
        status="not_supported",
        message=(
            "PDFium/XFA worker scaffold is connected, but real XFA form filling "
            "for IRCC templates has not been implemented yet."
        ),
        details=(
            "Next step: map template-specific XFA field names and implement "
            "save/export once target IRCC PDFs are validated with PDFium."
        ),
        echoedFieldCount=len(payload.applicantInfo),
        templateId=payload.templateId,
    )
