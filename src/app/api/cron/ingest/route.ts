import { NextResponse } from 'next/server';
import { ContinuousPipeline } from '@/lib/ingestion/pipeline/continuous-pipeline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const pipeline = new ContinuousPipeline();
    const result = await pipeline.runPipeline();

    if (result.status === 'LOCKED_SKIPPED') {
      return NextResponse.json(
        {
          success: true,
          status: 'LOCKED_SKIPPED',
          message: result.error,
          durationMs: result.durationMs,
        },
        { status: 200 }
      );
    }

    if (result.status === 'FAILED') {
      return NextResponse.json(
        {
          success: false,
          status: 'FAILED',
          error: result.error,
          durationMs: result.durationMs,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'SUCCESS',
      pipelineMetrics: {
        ingestion: result.ingestionMetrics,
        articlesClustered: result.articlesClustered,
        affectedStoriesRescored: result.affectedStoriesRescored,
        durationSeconds: Math.round((result.durationMs / 1000) * 100) / 100,
      },
      diagnostics: result.diagnostics,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
