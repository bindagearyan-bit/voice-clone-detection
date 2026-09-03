from pydantic import BaseModel, Field


class DetectionRequest(BaseModel):
    call_id: str = Field(..., description="Unique Identifier for the call session")
    chunk_id: str = Field(..., description="Sequential ID or timestamp for the audio chunk")
    phone_number: str = Field(..., description="Target phone number associated with the call")
    audio_data: str = Field(..., description="Base64 encoded raw audio string")


class DetectionResponse(BaseModel):
    chunk_id: str
    call_id: str
    risk_score: int = Field(..., ge=0, le=100, description="Deepfake risk score from 0 to 100")
    risk_level: str = Field(..., description="Risk tier: LOW, MODERATE, or HIGH")
    color: str = Field(..., description="Indicator color: GREEN, YELLOW, or RED")
    is_fake: bool = Field(..., description="True if classification meets fake threshold")
    reason: str = Field(..., description="Detailed diagnostic rationale")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model prediction confidence score")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of analysis")


class ChunkAnalysisResult(BaseModel):
    chunk_index: int
    chunk_id: str
    start_time_sec: float
    end_time_sec: float
    latency_ms: float
    risk_score: int
    risk_level: str
    color: str
    is_fake: bool
    confidence: float
    reason: str
    acoustic_metrics: dict = {}
    terminal_line: str


class AudioFileAnalysisResponse(BaseModel):
    filename: str
    file_size_bytes: int
    duration_sec: float
    sample_rate: int
    total_samples: int
    total_chunks: int
    chunk_duration_sec: float
    avg_risk_score: int
    max_risk_score: int
    final_verdict: str
    final_color: str
    is_fake: bool
    avg_latency_ms: float
    total_latency_ms: float
    terminal_output: str
    chunks: list[ChunkAnalysisResult]
    timestamp: str


class CallSummaryResponse(BaseModel):
    call_id: str
    phone_number: str
    total_chunks: int
    avg_risk_score: int
    max_risk_score: int
    final_verdict: str = Field(..., description="Aggregated call verdict: REAL, SUSPICIOUS, or FAKE")
    start_time: str
    end_time: str
