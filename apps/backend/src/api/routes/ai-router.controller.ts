import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  AIRouterService,
  UsageTrackingService,
  QuotaManagementService,
  ProviderHealthService,
  AIRequestDto,
  ImageGenerationRequestDto,
  AIResponseDto,
  ImageGenerationResponseDto,
  QuotaStatusDto,
  UsageStatsResponseDto,
  AITaskType,
  AccuracyLevel,
} from '@gitroom/nestjs-libraries/ai-router';

/**
 * AI Router Controller
 * REST API endpoints for the Hybrid AI Router system
 *
 * Provides:
 * - Text generation with automatic provider selection
 * - Image generation (DALL-E 3)
 * - Usage statistics and analytics
 * - Quota management
 * - System health monitoring
 */
@ApiTags('AI Router')
@Controller('ai-router')
// @UseGuards(JwtAuthGuard) // TODO: Uncomment when auth is set up
@ApiBearerAuth()
export class AIRouterController {
  private readonly logger = new Logger(AIRouterController.name);

  constructor(
    private readonly aiRouterService: AIRouterService,
    private readonly usageService: UsageTrackingService,
    private readonly quotaService: QuotaManagementService,
    private readonly healthService: ProviderHealthService,
  ) {}

  /**
   * Generate text completion
   * POST /ai-router/completion
   */
  @Post('completion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate text completion',
    description:
      'Generate text using the best available AI provider based on task type and accuracy requirements',
  })
  @ApiResponse({
    status: 200,
    description: 'Completion generated successfully',
    type: AIResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 429, description: 'Quota exceeded' })
  async generateCompletion(
    @Body() request: AIRequestDto,
  ): Promise<AIResponseDto> {
    this.logger.log(
      `Completion request: ${request.taskType} for org: ${request.organizationId}`,
    );

    return await this.aiRouterService.generateCompletion(request);
  }

  /**
   * Generate image
   * POST /ai-router/image
   */
  @Post('image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate image',
    description: 'Generate image using DALL-E 3',
  })
  @ApiResponse({
    status: 200,
    description: 'Image generated successfully',
    type: ImageGenerationResponseDto,
  })
  async generateImage(
    @Body() request: ImageGenerationRequestDto,
  ): Promise<ImageGenerationResponseDto> {
    this.logger.log(`Image generation request for org: ${request.organizationId}`);

    return await this.aiRouterService.generateImage(request);
  }

  /**
   * Get quota status
   * GET /ai-router/quota/:organizationId
   */
  @Get('quota/:organizationId')
  @ApiOperation({
    summary: 'Get quota status',
    description: 'Get current quota usage and limits for an organization',
  })
  @ApiResponse({ status: 200, description: 'Quota status retrieved' })
  async getQuotaStatus(
    @Param('organizationId') organizationId: string,
  ): Promise<QuotaStatusDto> {
    return await this.quotaService.getQuotaStatus(organizationId);
  }

  /**
   * Get usage statistics
   * GET /ai-router/usage/:organizationId
   */
  @Get('usage/:organizationId')
  @ApiOperation({
    summary: 'Get usage statistics',
    description: 'Get AI usage statistics for an organization',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Usage statistics retrieved' })
  async getUsageStatistics(
    @Param('organizationId') organizationId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<UsageStatsResponseDto> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const stats = await this.usageService.getUsageStatistics(
      organizationId,
      start,
      end,
    );

    // Transform to response DTO
    return {
      organizationId: stats.organizationId,
      period: stats.period,
      summary: {
        totalRequests: stats.totalRequests,
        successfulRequests: stats.successfulRequests,
        failedRequests: stats.failedRequests,
        successRate: stats.successfulRequests / stats.totalRequests,
        totalTokens: stats.totalTokens,
        totalCost: stats.totalCost,
        avgLatencyMs:
          Object.values(stats.byProvider).reduce(
            (sum: number, p: any) => sum + p.avgLatency * p.requests,
            0,
          ) / stats.totalRequests,
      },
      byProvider: stats.byProvider,
      byTaskType: stats.byTaskType,
      byAccuracy: stats.byAccuracy,
      topUsers: stats.topUsers,
    };
  }

  /**
   * Get cost breakdown
   * GET /ai-router/cost/:organizationId
   */
  @Get('cost/:organizationId')
  @ApiOperation({
    summary: 'Get cost breakdown',
    description: 'Get detailed cost breakdown and projections',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Cost breakdown retrieved' })
  async getCostBreakdown(
    @Param('organizationId') organizationId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return await this.usageService.getCostBreakdown(organizationId, start, end);
  }

  /**
   * Get system health
   * GET /ai-router/health
   */
  @Get('health')
  @ApiOperation({
    summary: 'Get system health',
    description: 'Get health status of all AI providers',
  })
  @ApiResponse({ status: 200, description: 'System health retrieved' })
  async getSystemHealth() {
    const systemHealth = this.healthService.getSystemHealth();

    return {
      healthy: systemHealth.healthy,
      availableProviders: systemHealth.availableProviders,
      totalProviders: systemHealth.totalProviders,
      providers: systemHealth.providers.map((p) => ({
        provider: p.provider,
        healthy: p.isHealthy,
        latencyMs: p.latencyMs,
        lastChecked: p.lastChecked,
        errorMessage: p.errorMessage,
      })),
      timestamp: new Date(),
    };
  }

  /**
   * Get quota recommendations
   * GET /ai-router/recommendations/:organizationId
   */
  @Get('recommendations/:organizationId')
  @ApiOperation({
    summary: 'Get recommendations',
    description: 'Get AI usage recommendations for cost optimization',
  })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved' })
  async getRecommendations(
    @Param('organizationId') organizationId: string,
  ): Promise<{ recommendations: string[] }> {
    const recommendations = await this.quotaService.getQuotaRecommendations(
      organizationId,
    );

    return { recommendations };
  }

  /**
   * Legacy compatibility endpoints
   * These wrap the existing OpenAI service methods
   */

  @Post('posts/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate social media posts (legacy)' })
  async generatePosts(
    @Body() body: { content: string; organizationId: string },
  ) {
    return await this.aiRouterService.generatePosts(
      body.content,
      body.organizationId,
    );
  }

  @Post('website/extract')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extract website text (legacy)' })
  async extractWebsite(
    @Body() body: { content: string; organizationId: string },
  ) {
    return await this.aiRouterService.extractWebsiteText(
      body.content,
      body.organizationId,
    );
  }

  @Post('posts/separate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Separate posts into threads (legacy)' })
  async separatePosts(
    @Body() body: { content: string; length: number; organizationId: string },
  ) {
    return await this.aiRouterService.separatePosts(
      body.content,
      body.length,
      body.organizationId,
    );
  }

  @Post('slides/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate slides from text (legacy)' })
  async generateSlides(
    @Body() body: { text: string; organizationId: string },
  ) {
    return await this.aiRouterService.generateSlidesFromText(
      body.text,
      body.organizationId,
    );
  }

  @Post('prompt/picture')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate prompt for picture (legacy)' })
  async generatePicturePrompt(
    @Body() body: { prompt: string; organizationId: string },
  ) {
    const result = await this.aiRouterService.generatePromptForPicture(
      body.prompt,
      body.organizationId,
    );
    return { prompt: result };
  }

  @Post('voice/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate voice text (legacy)' })
  async generateVoice(
    @Body() body: { prompt: string; organizationId: string },
  ) {
    const result = await this.aiRouterService.generateVoiceFromText(
      body.prompt,
      body.organizationId,
    );
    return { voice: result };
  }
}
